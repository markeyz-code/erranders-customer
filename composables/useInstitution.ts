import { ref } from 'vue';
import { institutions_api, type Institution } from '@/api_factory/modules/institutions';

/**
 * The selected campus (institution) — the tenancy key for the whole web app.
 *
 * Every request carries it as `X-Institution-Id` (see `api_factory/axios.config.ts`)
 * and the backend scopes its list queries to it, so the choice has to survive a
 * cold start. It is persisted twice on purpose:
 *
 *  - a **cookie** (`errandr_institution`) holding the id/slug, because the axios
 *    interceptor runs outside a Vue setup context and has to read it
 *    synchronously — exactly like it reads `errandr_token` for `Authorization`;
 *  - **localStorage**, holding the whole document so the drawer and the picker
 *    can render the campus name without a round trip.
 *
 * State lives at module scope so every caller shares the one selection, the
 * pattern used by the other composables in this app (`useVendors`, `useToast`).
 */

/** Cookie + storage key, in the same `errandr_*` family as the auth cookies. */
export const INSTITUTION_KEY = 'errandr_institution';

/** One year, in seconds — the selection should outlive a semester. */
const MAX_AGE_SECONDS = 60 * 60 * 24 * 365;

/** The persisted shape. `hasChosen` tells first run apart from "picked already". */
interface StoredInstitution {
  institution: Institution;
  hasChosen: boolean;
}

/* ── Module-scope state: one selection for the whole app ───────────────────── */

/** The currently selected campus. */
const institution = ref<Institution | null>(null);
/** All active campuses, for the picker. */
const institutions = ref<Institution[]>([]);
/** True while fetching the list or switching. */
const isLoading = ref(false);
/** False until the visitor has picked a campus. Restored from storage. */
const hasChosen = ref(false);
/**
 * True when the picker was asked for explicitly — the drawer's "Change" row.
 * The first-run picker is driven by `hasChosen` instead, so this only ever
 * re-opens a chooser the visitor already completed.
 */
const pickerRequested = ref(false);
/** Campus being switched to; drives the global `<CampusSwitchSplash>`. */
const splashTarget = ref<Institution | null>(null);
/** `restore()` is idempotent — boot it once per page load. */
let restored = false;

/* ── Guards and small synchronous readers ──────────────────────────────────── */

/**
 * A document is only usable as a campus if we can key it and show it. This
 * guards the persisted JSON against old/half-written/foreign payloads.
 */
const isInstitution = (value: unknown): value is Institution => {
  const candidate = value as Partial<Institution> | null | undefined;
  return (
    !!candidate &&
    typeof candidate === 'object' &&
    typeof candidate._id === 'string' &&
    typeof candidate.name === 'string' &&
    typeof candidate.slug === 'string'
  );
};

/** The value the `X-Institution-Id` header takes: the id, falling back to slug. */
const institutionKey = (inst: Institution | null | undefined): string =>
  inst?._id || inst?.slug || '';

/**
 * The selected campus id, synchronously and without Vue — this is what the axios
 * request interceptor calls to set `X-Institution-Id`. Returns `null` when
 * nothing is selected, in which case the backend keeps its unscoped
 * (public/legacy) behaviour.
 *
 * The `slug` is a valid header value too (the backend accepts an ObjectId or a
 * slug), so it is the fallback for a document that somehow lacks `_id`.
 */
export const getSelectedInstitutionId = (): string | null => {
  // SSR / prerender: there is no cookie jar here, so we send no header. The app
  // is a client-rendered SPA; the browser is the only place this matters.
  if (typeof document === 'undefined') return null;
  try {
    const match = document.cookie.match(new RegExp(`(^| )${INSTITUTION_KEY}=([^;]+)`));
    const value = match ? decodeURIComponent(match[2]) : '';
    return value || null;
  } catch {
    return null;
  }
};

/** Is there an auth token cookie? Read the same way the interceptor reads it. */
const hasAuthToken = (): boolean => {
  if (typeof document === 'undefined') return false;
  try {
    return /(^| )errandr_token=([^;]+)/.test(document.cookie);
  } catch {
    return false;
  }
};

/**
 * True on a vendor storefront subdomain (`<vendor>.erranders.org`), where the
 * whole page belongs to one vendor and a campus check-in makes no sense. Mirrors
 * the host detection in `middleware/subdomain.global.ts`.
 */
export const isVendorSubdomainHost = (): boolean => {
  if (typeof window === 'undefined') return false;
  try {
    const host = window.location.hostname;
    if (!host || host.includes('vercel.app')) return false;

    const parts = host.split('.');
    const isLocalhost = host === 'localhost' || host === '127.0.0.1';
    const hasSubdomain =
      parts.length >= 3 || (parts.length >= 2 && parts[parts.length - 1] === 'localhost');

    if (isLocalhost || !hasSubdomain) return false;
    return !['www', 'student', 'vendor', 'errandr-student'].includes(parts[0]);
  } catch {
    return false;
  }
};

/* ── Persistence ───────────────────────────────────────────────────────────── */

/** Write the selection to the cookie and localStorage (or clear both). */
const persistSelection = (inst: Institution | null) => {
  const id = institutionKey(inst);

  if (typeof document !== 'undefined') {
    try {
      // `SameSite=Lax` + `path=/` keeps it readable on the client for a year
      // without ever being sent cross-site.
      document.cookie = id
        ? `${INSTITUTION_KEY}=${encodeURIComponent(id)}; max-age=${MAX_AGE_SECONDS}; path=/; SameSite=Lax`
        : `${INSTITUTION_KEY}=; max-age=0; path=/; SameSite=Lax`;
    } catch (err) {
      console.warn('[institution] Could not persist the campus cookie:', err);
    }
  }

  if (typeof window !== 'undefined') {
    try {
      if (inst) {
        const payload: StoredInstitution = { institution: inst, hasChosen: true };
        window.localStorage.setItem(INSTITUTION_KEY, JSON.stringify(payload));
      } else {
        window.localStorage.removeItem(INSTITUTION_KEY);
      }
    } catch (err) {
      console.warn('[institution] Could not persist the selected campus:', err);
    }
  }
};

/** Read the stored campus document, tolerating junk and unavailable storage. */
const readStored = (): StoredInstitution | null => {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(INSTITUTION_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<StoredInstitution> | null;
    if (parsed && isInstitution(parsed.institution)) {
      return {
        institution: parsed.institution,
        // A stored campus with no explicit flag predates the flag: trust it.
        hasChosen: parsed.hasChosen !== false,
      };
    }
  } catch (err) {
    console.warn('[institution] Could not read the stored campus:', err);
  }
  return null;
};

/* ── Actions ───────────────────────────────────────────────────────────────── */

/** `GET /institutions` — caches the active campuses into `institutions`. */
const loadInstitutions = async (): Promise<void> => {
  isLoading.value = true;
  try {
    const res: any = await institutions_api.list();
    if (res?.type === 'ERROR') {
      // Keep whatever list we already have: a failed refresh shows stale
      // campuses, which beats an empty picker on a flaky connection.
      console.warn(
        '[institution] Could not load campuses:',
        res?.data?.message || res?.statusText || res?.status
      );
      return;
    }

    const payload = res?.data ?? res?.value;
    const raw: any[] = Array.isArray(payload)
      ? payload
      : Array.isArray(payload?.institutions)
        ? payload.institutions
        : Array.isArray(payload?.data)
          ? payload.data
          : [];

    institutions.value = raw.filter(
      // The endpoint already hides inactive campuses; filter anyway so a
      // future/legacy response can never offer a dead campus in the picker.
      (inst) => isInstitution(inst) && inst.isActive !== false
    );
  } catch (err) {
    console.warn('[institution] Could not load campuses:', err);
  } finally {
    isLoading.value = false;
  }
};

/**
 * We know which campus was chosen but lost its document (cleared storage, or a
 * cookie shared with another tab). Re-fetch it quietly so the drawer has a name
 * to show; a failure is harmless because the header only needs the id.
 */
const hydrateSelection = async (idOrSlug: string): Promise<void> => {
  try {
    const res: any = await institutions_api.get(idOrSlug);
    if (res?.type === 'ERROR') return;
    const payload = res?.data ?? res?.value;
    const doc = payload?.institution ?? payload;
    if (isInstitution(doc)) {
      institution.value = doc;
      persistSelection(doc);
    }
  } catch (err) {
    console.warn('[institution] Could not rehydrate the selected campus:', err);
  }
};

/**
 * Select a campus. Confirms the choice with `PATCH /users/me/institution` when
 * the visitor is signed in, but ALWAYS persists locally and never throws — an
 * offline or failing backend must never leave the visitor unable to browse.
 *
 * The switch also raises `splashTarget`, which is what mounts the global
 * switching splash; the splash is time-boxed (not tied to this request) and
 * clears itself through `endCampusSwitch()` when its animation finishes.
 */
const switchInstitution = async (inst: Institution): Promise<void> => {
  if (!isInstitution(inst)) return;

  splashTarget.value = inst;
  isLoading.value = true;

  try {
    // Clear student cart on campus switch so old campus items don't linger
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.removeItem('errandr_cart_multi_v1');
        window.localStorage.removeItem('errandr_market_pool_cart');
      } catch (e) {}
    }

    // Sent while the previous campus is still selected, so the header matches
    // the session and the body carries the new id.
    if (hasAuthToken()) {
      try {
        const res: any = await institutions_api.setMine(institutionKey(inst));
        if (res?.type === 'ERROR') {
          console.warn(
            '[institution] Could not pin the campus on the server; keeping it locally:',
            res?.data?.message || res?.statusText || res?.status
          );
        }
      } catch (err) {
        console.warn('[institution] Could not pin the campus on the server; keeping it locally:', err);
      }
    }

    institution.value = inst;
    hasChosen.value = true;
    pickerRequested.value = false;
    persistSelection(inst);
  } finally {
    isLoading.value = false;
  }
};

/** On sign-out: reset the selection (and forget it on the cookie and on disk). */
const clear = (): void => {
  // Keep `institutions` cached — it is public data and the next picker render is
  // instant — but forget the selection everywhere.
  institution.value = null;
  hasChosen.value = false;
  isLoading.value = false;
  pickerRequested.value = false;
  splashTarget.value = null;
  persistSelection(null);
  restored = true;
};

/** Rehydrate the persisted selection. Safe to call more than once. */
const restore = (): void => {
  if (restored) return;
  restored = true;

  const stored = readStored();
  if (stored) {
    institution.value = stored.institution;
    hasChosen.value = stored.hasChosen;
    // Heal a cookie that was cleared but whose document survived on disk: the
    // axios interceptor reads the cookie only.
    if (!getSelectedInstitutionId()) persistSelection(stored.institution);
    return;
  }

  const id = getSelectedInstitutionId();
  if (!id) {
    institution.value = null;
    hasChosen.value = false;
    return;
  }

  // A campus WAS chosen but its document is gone. Trust the choice — never trap
  // the visitor behind the picker — and rehydrate the document in the
  // background: the header already has everything it needs.
  hasChosen.value = true;
  void hydrateSelection(id);
};

/** Open the chooser on demand (the drawer's "Change campus" row). */
const openPicker = (): void => {
  pickerRequested.value = true;
  // A change request with no cached list (offline boot) refetches: the overlay
  // stays hidden until the list actually exists.
  if (institutions.value.length === 0) void loadInstitutions();
};

/** Dismiss the chooser (after a selection or an explicit cancel). */
const closePicker = (): void => {
  pickerRequested.value = false;
};

/** Called by the splash once its animation is done, so it can unmount. */
const endCampusSwitch = (): void => {
  splashTarget.value = null;
  if (typeof window !== 'undefined') {
    // Navigate cleanly to home if on a detail page, or reload to refresh all campus-scoped queries
    if (window.location.pathname.startsWith('/vendor/') || window.location.pathname.startsWith('/services/')) {
      window.location.href = '/';
    } else {
      window.location.reload();
    }
  }
};

export const useInstitution = () => ({
  /* state */
  institution,
  institutions,
  isLoading,
  hasChosen,
  /* actions */
  loadInstitutions,
  switchInstitution,
  clear,
  restore,
  /* picker + splash plumbing, shared with the global overlays and the drawer */
  pickerRequested,
  openPicker,
  closePicker,
  splashTarget,
  endCampusSwitch,
});

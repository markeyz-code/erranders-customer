import {
  GATEWAY_ENDPOINT,
  GATEWAY_ENDPOINT_WITH_AUTH,
  type CustomAxiosResponse,
} from '../axios.config';

/**
 * A campus. Mirrors `backend/src/modules/institutions/schemas/institution.schema.ts`
 * and the contract in `marketplace/mobile/docs/INSTITUTIONS.md`.
 *
 * `_id`, `name`, `shortName`, `slug`, `city`, `state`, `branding` and
 * `supportedAppTypes` are always present — they are what `GET /institutions`
 * projects for the picker. The remaining fields only come back from the
 * single-campus endpoint (`GET /institutions/:idOrSlug`), so they are optional
 * here: reading them without a guard would be a runtime crash waiting to happen.
 */
export interface InstitutionBranding {
  /** Hex colour, e.g. `#FF5C1A`. Lets a campus theme itself later. */
  primaryColor?: string;
  tagline?: string;
  logoUrl?: string;
}

/** GeoJSON point. Coordinates are `[longitude, latitude]` — GeoJSON order. */
export interface InstitutionCenter {
  type: 'Point';
  coordinates: [number, number];
}

/** The app variants a campus supports (build variants, not backend roles). */
export type InstitutionAppType = 'student' | 'vendor' | 'dispatch';

export interface Institution {
  _id: string;
  /** Full legal-ish name, e.g. `College of Medicine, University of Lagos`. */
  name: string;
  /** `CMUL` — shown in chips and the drawer. */
  shortName: string;
  /** `cmul` — unique, lowercase, URL-safe; the stable public key. */
  slug: string;
  city: string;
  state: string;
  country: string;
  /** Campus centre. Detail endpoint only. */
  center?: InstitutionCenter;
  /** Delivery radius in km (backend default 8). Detail endpoint only. */
  deliveryRadiusKm?: number;
  /** Inactive campuses are hidden from the picker. */
  isActive?: boolean;
  branding: InstitutionBranding;
  /** Subset of `['student', 'vendor', 'dispatch']`. */
  supportedAppTypes: InstitutionAppType[];
  contactPhone?: string;
  contactEmail?: string;
}

/** Light counts returned by `GET /institutions/:idOrSlug/stats`. */
export interface InstitutionStats {
  vendors: number;
  services: number;
}

export const institutions_api = {
  /** Active campuses for the picker (public). Never returns inactive ones. */
  list: (): Promise<CustomAxiosResponse> => GATEWAY_ENDPOINT.get('/institutions'),

  /** One campus, full detail (public). Accepts an ObjectId or a slug. */
  get: (idOrSlug: string): Promise<CustomAxiosResponse> =>
    GATEWAY_ENDPOINT.get(`/institutions/${encodeURIComponent(idOrSlug)}`),

  /** Light counts (vendors, services) for the picker card (public). */
  stats: (idOrSlug: string): Promise<CustomAxiosResponse> =>
    GATEWAY_ENDPOINT.get(`/institutions/${encodeURIComponent(idOrSlug)}/stats`),

  /** Batch vendor & service counts for all campuses in one call (public). */
  allStats: (): Promise<CustomAxiosResponse> =>
    GATEWAY_ENDPOINT.get('/institutions/summary/stats'),

  /**
   * Pin the signed-in user to a campus. Auth-protected and tenancy-enforcing:
   * the backend returns the updated user document.
   */
  setMine: (institutionId: string): Promise<CustomAxiosResponse> =>
    GATEWAY_ENDPOINT_WITH_AUTH.patch('/users/me/institution', { institutionId }),
};

/** Alias matching the mobile app's module name, for cross-repo familiarity. */
export const institutionsApi = institutions_api;

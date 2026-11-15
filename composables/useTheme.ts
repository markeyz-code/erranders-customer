/**
 * Theme switching, in one place.
 *
 * There were three copies of this logic (landing page, its navbar, the dashboard layout), and when
 * one copy was missing its definitions the toggle threw and the page went blank. One implementation
 * cannot drift from itself.
 *
 * Light is the default. Dark is chosen explicitly, with the operating system deciding only while no
 * choice has been made.
 */
import { computed, onMounted, onBeforeUnmount, ref } from 'vue';

const STORAGE_KEY = 'erranders-theme';

const isDark = ref(false);

const readStored = (): boolean | null => {
  try {
    const saved = typeof localStorage !== 'undefined' ? localStorage.getItem(STORAGE_KEY) : null;
    if (saved === 'dark') return true;
    if (saved === 'light') return false;
    return null;
  } catch {
    // Private mode or blocked storage: remember nothing, still usable.
    return null;
  }
};

const apply = (dark: boolean, persist: boolean) => {
  isDark.value = dark;
  try {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.toggle('dark', dark);
      // `light` is explicit, so a student on a dark machine can still choose light.
      root.classList.toggle('light', !dark);
      root.dataset.theme = dark ? 'dark' : 'light';
    }
    if (persist && typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    }
  } catch {
    // A failed class write must never take the page down.
  }
};

export const setTheme = (dark: boolean, persist = true) => apply(dark, persist);

export const useTheme = () => {
  onMounted(() => {
    const stored = readStored();
    apply(stored ?? false, false);
  });

  const toggleTheme = () => apply(!isDark.value, true);

  return {
    isDark: computed(() => isDark.value),
    toggleTheme,
    setTheme,
  };
};

export const useThemeState = () => ({
  isDark: computed(() => isDark.value),
});

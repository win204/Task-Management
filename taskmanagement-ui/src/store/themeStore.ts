import { create } from 'zustand';

type Theme = 'light' | 'dark' | 'system';

interface ThemeState {
  theme: Theme;
  resolved: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

function getSystemTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function resolveTheme(theme: Theme): 'light' | 'dark' {
  return theme === 'system' ? getSystemTheme() : theme;
}

function applyTheme(resolved: 'light' | 'dark') {
  const root = document.documentElement;
  if (resolved === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

const STORAGE_KEY = 'taskflow_theme';

function getStoredTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark' || stored === 'system') {
      return stored;
    }
  } catch {
    // localStorage not available
  }
  return 'light';
}

export const useThemeStore = create<ThemeState>((set) => {
  const initial = getStoredTheme();
  const resolved = resolveTheme(initial);

  // Apply on initialization
  applyTheme(resolved);

  // Listen for system theme changes when 'system' is selected
  if (typeof window !== 'undefined') {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      const state = useThemeStore.getState();
      if (state.theme === 'system') {
        const newResolved = getSystemTheme();
        applyTheme(newResolved);
        set({ resolved: newResolved });
      }
    });
  }

  return {
    theme: initial,
    resolved,
    setTheme: (theme: Theme) => {
      const resolved = resolveTheme(theme);
      applyTheme(resolved);
      localStorage.setItem(STORAGE_KEY, theme);
      set({ theme, resolved });
    },
    toggleTheme: () => {
      set((state) => {
        const next = state.resolved === 'dark' ? 'light' : 'dark';
        applyTheme(next);
        localStorage.setItem(STORAGE_KEY, next);
        return { theme: next, resolved: next };
      });
    },
  };
});

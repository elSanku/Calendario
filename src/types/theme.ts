//INI SPEC-005 - 01
// Tipos de tema y utilidades de persistencia para conmutador de temas
export type AppTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'calendar-theme';

export const DEFAULT_THEME: AppTheme = 'dark';

export const isValidTheme = (value: unknown): value is AppTheme => {
  return value === 'light' || value === 'dark';
};

export const getStoredTheme = (): AppTheme => {
  try {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (isValidTheme(stored)) {
      return stored;
    }
  } catch {
    // Fallback ante fallo de storage (e.g., navegación privada o cuota excedida)
  }
  return DEFAULT_THEME;
};
//FIN SPEC-005 - 01

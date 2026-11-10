# Plan Técnico — Spec 005: Conmutador de Temas: Modo "Soft UI Cálido" y "Midnight Vibe"

## 1. Resumen de la Solución
Este plan técnico detalla la arquitectura para incorporar el soporte nativo, accesible y persistente de conmutación de temas en **Antigravity Calendar**:
1. **Definición de Tipos y Almacenamiento (`src/types/theme.ts`)**: Crear un módulo dedicado con el tipo unión `AppTheme = 'light' | 'dark'`, constantes de almacenamiento y funciones de validación robusta con fallback a `'dark'`.
2. **Tokens Globales Duales en `src/index.css`**: Configurar variables CSS globales completas para ambos temas:
   - `:root, [data-theme="dark"]`: Preserva intacta la paleta consolidada de **Midnight Vibe** (obsidiana, navy, turquesa `#06B6D4` y violeta `#8B5CF6`).
   - `[data-theme="light"]`: Restaura y refina la paleta de **Soft UI Cálido** (lino `#F4F0EA`, tarjeta `#FFFFFF`, superficies secundarias `#FBF9F5`, acento terracota `#C85A32` y texto carbón `#262422`).
   - Transiciones suaves de color y gradientes ambientales diferenciados en `body`.
3. **Sección "Apariencia" en `UserProfileBadge`**: Extender el componente del perfil de usuario incorporando una sección accesible delimitada con `role="separator"`, dos opciones con `role="menuitemradio"` ("Modo Claro" con icono `Sun` y "Modo Oscuro" con icono `Moon`), indicación visual con `Check` y atributo `aria-checked`.
4. **Propagación en `Header.tsx`**: Canalizar las props `theme?: AppTheme` y `onThemeChange?: (newTheme: AppTheme) => void` desde la raíz hasta `UserProfileBadge`.
5. **Gestión de Estado Central en `src/App.tsx`**: Estado reactivo `theme` inicializado con lectura perezosa desde `localStorage`, sincronización bidireccional inmediata con `document.documentElement.setAttribute('data-theme', theme)` y persistencia segura.
6. **Cobertura Integral de Pruebas**: Suites unitarias actualizadas (`UserProfileBadge.test.tsx`, `Header.test.tsx`) y pruebas de integración en `App.test.tsx`.

---

## 2. Arquitectura Frontend y Componentes

### 2.1 Modelo de Datos y Tipos (`src/types/theme.ts`)
Se creará un nuevo archivo modular independiente para encapsular la lógica del tema:
```typescript
// src/types/theme.ts
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
    // Manejo de restricciones de localStorage (incógnito, cuota)
  }
  return DEFAULT_THEME;
};
```

---

### 2.2 Tokens CSS Globales (`src/index.css`)
Se reorganizarán los tokens globales para soportar ambos temas mediante selectores de atributo:

#### A. Modo Oscuro ("Midnight Vibe" — Predeterminado): `:root, [data-theme="dark"]`
```css
:root,
[data-theme="dark"] {
  /* Fondos y Superficies Midnight Vibe */
  --bg-canvas: #0B0E14;
  --bg-surface: #181E2B;
  --bg-surface-elevated: #121620;
  --bg-subtle: #1F2637;

  /* Bordes y Divisores */
  --border-subtle: rgba(255, 255, 255, 0.07);
  --border-strong: #262F43;

  /* Colores de Acento */
  --accent-primary: #06B6D4;
  --accent-hover: #0891B2;
  --accent-light: rgba(6, 182, 212, 0.12);
  --accent-contrast: #082F49;
  --accent-glow: 0 4px 20px rgba(6, 182, 212, 0.35);

  --accent-secondary: #8B5CF6;
  --accent-secondary-light: rgba(139, 92, 246, 0.15);
  --accent-secondary-text: #A78BFA;

  /* Jerarquía de Texto */
  --text-primary: #F1F5F9;
  --text-secondary: #94A3B8;
  --text-tertiary: #475569;

  /* Sombras Táctiles Midnight */
  --shadow-soft-sm: 0 2px 8px rgba(0, 0, 0, 0.35);
  --shadow-soft-md: 0 4px 18px rgba(0, 0, 0, 0.45), 0 0 1px rgba(255, 255, 255, 0.08);
  --shadow-soft-lg: 0 20px 50px rgba(0, 0, 0, 0.65), 0 0 1px rgba(255, 255, 255, 0.1);
  --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.4);

  /* Categorías de Eventos Midnight Vibe */
  --cat-work-bg: rgba(56, 189, 248, 0.15);
  --cat-work-text: #7DD3FC;
  --cat-work-dot: #38BDF8;

  --cat-personal-bg: rgba(16, 185, 129, 0.15);
  --cat-personal-text: #6EE7B7;
  --cat-personal-dot: #10B981;

  --cat-health-bg: rgba(168, 85, 247, 0.15);
  --cat-health-text: #D8B4FE;
  --cat-health-dot: #A855F7;

  --cat-important-bg: rgba(244, 63, 94, 0.15);
  --cat-important-text: #FDA4AF;
  --cat-important-dot: #F43F5E;
}
```

#### B. Modo Claro ("Soft UI Cálido"): `[data-theme="light"]`
```css
[data-theme="light"] {
  /* Fondos y Superficies Soft UI Cálido */
  --bg-canvas: #F4F0EA;            /* Lienzo lino/arena suave cálido */
  --bg-surface: #FBF9F5;           /* Celdas de días y paneles secundarios */
  --bg-surface-elevated: #FFFFFF;  /* Tarjeta central del calendario */
  --bg-subtle: #EDE8E1;            /* Buscador, inputs y controles neutros */

  /* Bordes y Divisores */
  --border-subtle: rgba(40, 36, 33, 0.08);
  --border-strong: #D8D1C7;

  /* Color Primario de Acento (Terracota Artesanal #C85A32) */
  --accent-primary: #C85A32;
  --accent-hover: #B24E29;
  --accent-light: rgba(200, 90, 50, 0.12);
  --accent-contrast: #FFFFFF;
  --accent-glow: 0 4px 16px rgba(200, 90, 50, 0.25);

  /* Acento Secundario (Ámbar Cálido #D97706) */
  --accent-secondary: #D97706;
  --accent-secondary-light: rgba(217, 119, 6, 0.12);
  --accent-secondary-text: #B45309;

  /* Jerarquía de Texto Soft UI (Carbón y Grafito) */
  --text-primary: #262422;         /* Carbón suave: legibilidad óptima */
  --text-secondary: #6B6560;       /* Grafito medio: etiquetas y cabeceras */
  --text-tertiary: #9C948B;        /* Tono lino atenuado: días fuera de mes */

  /* Sombras Táctiles Multicapa Suaves */
  --shadow-soft-sm: 0 2px 6px rgba(40, 36, 33, 0.05);
  --shadow-soft-md: 0 6px 18px rgba(40, 36, 33, 0.07), 0 1px 3px rgba(40, 36, 33, 0.04);
  --shadow-soft-lg: 0 16px 36px rgba(40, 36, 33, 0.09), 0 2px 6px rgba(40, 36, 33, 0.04);
  --shadow-inset: inset 0 2px 4px rgba(40, 36, 33, 0.04);

  /* Categorías de Eventos Soft UI (WCAG AA en fondo claro) */
  --cat-work-bg: rgba(14, 116, 144, 0.10);
  --cat-work-text: #0E7490;
  --cat-work-dot: #0891B2;

  --cat-personal-bg: rgba(16, 185, 129, 0.12);
  --cat-personal-text: #047857;
  --cat-personal-dot: #10B981;

  --cat-health-bg: rgba(147, 51, 234, 0.10);
  --cat-health-text: #7E22CE;
  --cat-health-dot: #9333EA;

  --cat-important-bg: rgba(225, 29, 72, 0.10);
  --cat-important-text: #BE123C;
  --cat-important-dot: #E11D48;
}
```

#### C. Gradientes Ambientales Dinámicos y Transiciones
```css
body {
  transition: background-color 200ms ease, color 200ms ease;
}

:root body,
[data-theme="dark"] body {
  background-image: 
    radial-gradient(circle at 14% 16%, rgba(6, 182, 212, 0.05) 0%, transparent 40%),
    radial-gradient(circle at 86% 84%, rgba(139, 92, 246, 0.04) 0%, transparent 45%);
}

[data-theme="light"] body {
  background-image: 
    radial-gradient(circle at 14% 16%, rgba(200, 90, 50, 0.04) 0%, transparent 40%),
    radial-gradient(circle at 86% 84%, rgba(217, 119, 6, 0.035) 0%, transparent 45%);
}
```

---

### 2.3 Extensión de `UserProfileBadge` (`src/components/UserProfileBadge/`)
Se enriquecerá el menú contextual para albergar la sección de apariencia:
- **Nuevas Props**:
  ```typescript
  export interface UserProfileBadgeProps {
    profile?: UserProfile;
    onRoleChange?: (newRole: UserProfileRole) => void;
    theme?: AppTheme;
    onThemeChange?: (newTheme: AppTheme) => void;
  }
  ```
- **JSX del Menú Extendido**:
  ```tsx
  {/* Sección 1: Contexto de calendario (Roles) */}
  <div className={styles.menuHeader}>
    <span className={styles.menuTitle}>Contexto de calendario</span>
  </div>
  <div className={styles.menuItems}>
    {/* Botones de rol Personal / Trabajo */}
  </div>

  {/* Divisor de secciones */}
  <div className={styles.menuDivider} role="separator" />

  {/* Sección 2: Apariencia */}
  <div className={styles.menuHeader}>
    <span className={styles.menuTitle}>Apariencia</span>
  </div>
  <div className={styles.menuItems}>
    <button
      type="button"
      role="menuitemradio"
      aria-checked={theme === 'light'}
      className={`${styles.menuItem} ${theme === 'light' ? styles.menuItemActive : ''}`}
      onClick={() => handleThemeSelect('light')}
    >
      <div className={styles.itemWithIcon}>
        <Sun size={15} className={styles.themeIcon} aria-hidden="true" />
        <span className={styles.roleLabel}>Modo Claro</span>
      </div>
      {theme === 'light' && (
        <Check size={14} className={styles.checkIcon} aria-hidden="true" />
      )}
    </button>

    <button
      type="button"
      role="menuitemradio"
      aria-checked={theme === 'dark'}
      className={`${styles.menuItem} ${theme === 'dark' ? styles.menuItemActive : ''}`}
      onClick={() => handleThemeSelect('dark')}
    >
      <div className={styles.itemWithIcon}>
        <Moon size={15} className={styles.themeIcon} aria-hidden="true" />
        <span className={styles.roleLabel}>Modo Oscuro</span>
      </div>
      {theme === 'dark' && (
        <Check size={14} className={styles.checkIcon} aria-hidden="true" />
      )}
    </button>
  </div>
  ```
- **Estilos en `UserProfileBadge.module.css`**:
  - `.menuDivider`: Altura de 1px, fondo `var(--border-subtle)`, márgenes verticales balanceados (6px 0).
  - `.itemWithIcon`: Contenedor flex con `align-items: center` y `gap: 8px`.
  - `.themeIcon`: Color coordinado con `var(--text-secondary)`.

---

### 2.4 Canalización en `Header.tsx`
- En `src/components/Header/Header.tsx`, ampliar `HeaderProps`:
  ```typescript
  export interface HeaderProps {
    // ...props existentes...
    theme?: AppTheme;
    onThemeChange?: (newTheme: AppTheme) => void;
  }
  ```
- Pasar las props a `<UserProfileBadge ... theme={theme} onThemeChange={onThemeChange} />`.

---

### 2.5 Gestión de Estado Central en `src/App.tsx`
- Inicialización perezosa:
  ```typescript
  const [theme, setTheme] = useState<AppTheme>(getStoredTheme);
  ```
- Sincronización con el DOM y almacenamiento:
  ```typescript
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Manejo seguro en caso de restricciones de almacenamiento
    }
  }, [theme]);
  ```
- Conmutador:
  ```typescript
  const handleThemeChange = (newTheme: AppTheme) => {
    setTheme(newTheme);
  };
  ```

---

## 3. Plan de Pruebas Unitarias y de Integración

### 3.1 Suite Unitaria `UserProfileBadge.test.tsx`
1. Verificar que el menú muestra la sección "Apariencia" con las opciones "Modo Claro" y "Modo Oscuro".
2. Validar que la opción activa refleja `aria-checked="true"` y la inactiva `aria-checked="false"`.
3. Validar que al pulsar "Modo Claro" se invoca `onThemeChange('light')` y se cierra el menú.
4. Validar que al pulsar "Modo Oscuro" se invoca `onThemeChange('dark')` y se cierra el menú.
5. Comprobar que los iconos `Sun` y `Moon` se renderizan apropiadamente.

### 3.2 Suite Unitaria `Header.test.tsx`
1. Verificar que `Header` pasa correctamente las props `theme` y `onThemeChange` al componente `UserProfileBadge`.
2. Validar que todas las interacciones existentes (búsqueda, navegación de mes) continúan operando al 100%.

### 3.3 Suite de Integración en `src/App.test.tsx`
1. **Flujo de Conmutación de Tema**:
   - Abrir el menú de perfil, pulsar sobre "Modo Claro".
   - Verificar que `document.documentElement.getAttribute('data-theme')` es `'light'`.
   - Verificar que `localStorage.getItem('calendar-theme')` es `'light'`.
2. **Flujo de Carga Inicial Persistida**:
   - Pre-cargar `localStorage.setItem('calendar-theme', 'light')`.
   - Montar la aplicación y verificar que se inicia en `'light'`.
3. **Flujo de Resiliencia ante Valor Corrupto**:
   - Pre-cargar `localStorage.setItem('calendar-theme', 'invalido')`.
   - Montar la aplicación y comprobar que se aplica de manera segura el tema predeterminado `'dark'`.

---

## 4. Trazabilidad de Marcas de Auditoría
Todas las intervenciones se delimitarán estrictamente con las marcas oficiales de la Spec 005:
- Marcas TypeScript / JSX: `//INI SPEC-005 - NN` y `//FIN SPEC-005 - NN`
- Marcas CSS: `/* INI SPEC-005 - NN */` y `/* FIN SPEC-005 - NN */`
- Las marcas históricas (`SPEC-001`, `SPEC-002`, `SPEC-003`, `SPEC-004`) se mantendrán rigurosamente intactas.

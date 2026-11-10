# Tareas — Spec 005: Conmutador de Temas: Modo "Soft UI Cálido" y "Midnight Vibe"

Checklist de ejecución atómica y secuencial (20-30 min por tarea). Cada tarea debe ejecutarse de forma aislada, preservar intactas las marcas históricas (`SPEC-001`, `SPEC-002`, `SPEC-003` y `SPEC-004`), delimitar sus bloques con `//INI SPEC-005 - NN` y `//FIN SPEC-005 - NN` (o `/* INI SPEC-005 - NN */` en CSS) y verificar que la compilación (`npm run build`) y las pruebas (`npm run test`) se mantengan en verde.

- [x] **T1. Tipos de tema y utilidades de persistencia en `src/types/theme.ts`.** RF-1, RF-2, RNF-4
  - *Hecho cuando*:
    1. Se cree el archivo `src/types/theme.ts` con el tipo unión `AppTheme = 'light' | 'dark'`.
    2. Se definan las constantes `THEME_STORAGE_KEY = 'calendar-theme'` y `DEFAULT_THEME: AppTheme = 'dark'`.
    3. Se implementen las funciones utilitarias puras `isValidTheme(value: unknown): value is AppTheme` y `getStoredTheme(): AppTheme` con manejo seguro ante excepciones de `localStorage`.
    4. La suite existente de pruebas continúe pasando al 100% en verde (`npm run test`).
  - *Marcas*: `//INI SPEC-005 - 01` y `//FIN SPEC-005 - 01`

- [x] **T2. Tokens CSS globales duales y gradientes ambientales en `src/index.css`.** RF-7, RF-8, RNF-2, RNF-3
  - *Hecho cuando*:
    1. Se organice `src/index.css` de modo que `:root, [data-theme="dark"]` preserve íntegramente la paleta **Midnight Vibe** (obsidiana `#0B0E14`, navy `#121620`, turquesa `#06B6D4`, violeta `#8B5CF6`).
    2. Se defina el bloque de reglas `[data-theme="light"]` con el set completo de variables para **Soft UI Cálido** (lienzo lino `#F4F0EA`, tarjeta `#FFFFFF`, celdas `#FBF9F5`, acento terracota `#C85A32`, texto carbón `#262422`, sombras multicapa cálidas y chips de categoría adaptados).
    3. Se configuren los gradientes ambientales específicos de `body` para cada tema y una transición suave de 200ms para `background-color`, `border-color` y `color`.
    4. Se verifique la compilación limpia con `npm run build`.
  - *Marcas*: `/* INI SPEC-005 - 02 */` y `/* FIN SPEC-005 - 02 */`

- [x] **T3. Extensión de `UserProfileBadge` con la sección accesible "Apariencia" en `src/components/UserProfileBadge/`.** RF-4, RF-5, RF-6, RNF-1
  - *Hecho cuando*:
    1. Se añadan las props `theme?: AppTheme` y `onThemeChange?: (newTheme: AppTheme) => void` en `UserProfileBadgeProps`.
    2. Se incorpore en el menú flotante el divisor accesible (`role="separator"`) y la subsección con título `"Apariencia"`.
    3. Se rendericen las dos opciones "Modo Claro" (con icono `Sun` de `lucide-react`) y "Modo Oscuro" (con icono `Moon` de `lucide-react`), ambas con `role="menuitemradio"`, `aria-checked` e icono `Check` en la opción activa.
    4. Al pulsar cualquiera de las opciones se invoque `onThemeChange`, se cierre el menú y se devuelva el foco al botón disparador del perfil.
    5. Se añadan las clases `.menuDivider`, `.itemWithIcon` y `.themeIcon` en `UserProfileBadge.module.css`.
  - *Marcas*: `//INI SPEC-005 - 03` y `//FIN SPEC-005 - 03` / `/* INI SPEC-005 - 03 */` y `/* FIN SPEC-005 - 03 */`

- [x] **T4. Canalización y propagación de tema en `src/components/Header/Header.tsx`.** RF-5, RF-6
  - *Hecho cuando*:
    1. Se incorporen `theme?: AppTheme` y `onThemeChange?: (newTheme: AppTheme) => void` a la interfaz `HeaderProps` en `Header.tsx`.
    2. Se propaguen dichas props al componente `<UserProfileBadge ... theme={theme} onThemeChange={onThemeChange} />` dentro de `rightSection`.
    3. Se verifique que las funciones previas del Header (buscador, navegación de mes, botón hoy) no sufran regresiones.
  - *Marcas*: `//INI SPEC-005 - 04` y `//FIN SPEC-005 - 04`

- [x] **T5. Estado reactivo, persistencia en `localStorage` y sincronización con el elemento raíz en `src/App.tsx`.** RF-2, RF-3, RNF-2
  - *Hecho cuando*:
    1. Se importe `AppTheme`, `THEME_STORAGE_KEY` y `getStoredTheme` en `src/App.tsx`.
    2. Se defina el estado reactivo `const [theme, setTheme] = useState<AppTheme>(getStoredTheme);`.
    3. Se configure un `useEffect` que sincronice de forma inmediata `document.documentElement.setAttribute('data-theme', theme)` y guarde el valor en `localStorage`.
    4. Se pase `theme` y el manejador `handleThemeChange` al componente `<Header />`.
    5. Se compruebe que al recargar la pestaña del navegador el tema se mantiene consistente.
  - *Marcas*: `//INI SPEC-005 - 05` y `//FIN SPEC-005 - 05`

- [x] **T6. Pruebas unitarias (`UserProfileBadge`, `Header`), pruebas de integración (`App.test.tsx`), verificación global y cierre documental.** RNF-1 a RNF-5
  - *Hecho cuando*:
    1. Se actualice `UserProfileBadge.test.tsx` cubriendo el renderizado de la sección "Apariencia", la visualización de iconos solar/lunar, la alternancia de tema por clic y el marcado `aria-checked`.
    2. Se actualice `Header.test.tsx` verificando la transmisión correcta de props de tema.
    3. Se agreguen pruebas de integración en `src/App.test.tsx` verificando la conmutación interactiva, la modificación del atributo `data-theme` en el DOM y la persistencia en `localStorage`.
    4. `npm run build`, `npm run test` y `npm run lint` finalicen con 0 errores y 100% de tests en verde.
    5. Se actualice el estado en `specs/005-conmutador-tema-soft-ui-midnight/spec.md` y `MEMORY.md`.
  - *Marcas*: `//INI SPEC-005 - 06` y `//FIN SPEC-005 - 06`

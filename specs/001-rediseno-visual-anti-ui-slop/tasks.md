# Tareas — Spec 001: Rediseño Visual Profesional (Anti-UI Slop)

Checklist de ejecución atómica para la implementación del rediseño visual Soft UI.

- [x] **T1. Tokens globales Soft UI y tipografía de sistema en `src/index.css`.** RF-1, RF-4, RNF-3
  - *Hecho cuando*: Se declaren las variables `:root` con la paleta de fondos neutros cálidos, acento terracota, sombras multicapa y radios en `src/index.css`, y `npm run build` compile sin advertencias.
  - *Marcas*: `/* INI SPEC-001 - 01 */` y `/* FIN SPEC-001 - 01 */`

- [x] **T2. Contenedor principal y estructura adaptable en `src/App.module.css` y `src/App.tsx`.** RF-1, RF-2, RF-7, RF-8
  - *Hecho cuando*: El fondo de la aplicación sea el canvas cálido `#f4f3ef`, la tarjeta principal tenga sombra suave `var(--shadow-soft-lg)` y esquinas de 24px, y se configure el soporte para paneles colapsables en móvil; `npm run test` pase.
  - *Marcas*: `//INI SPEC-001 - 02` y `//FIN SPEC-001 - 02`

- [x] **T3. Rediseño visual del Header en `src/components/Header/`.** RF-1, RF-2, RF-8
  - *Hecho cuando*: El Header adopte la paleta neutra cálida, tipografía semibold, micro-relieve táctil en botones y soporte de controles de apertura para vista móvil; el build y tests compilen.
  - *Marcas*: `//INI SPEC-001 - 03` y `//FIN SPEC-001 - 03`

- [x] **T4. Rediseño visual del Sidebar en `src/components/Sidebar/`.** RF-1, RF-2, RF-3, RF-8
  - *Hecho cuando*: Se elimine completamente el color lila `#7b68ee`, el mes activo se destaque en terracota suave, el selector de año tenga botones táctiles y el componente soporte modo drawer en móvil; `Sidebar.test.tsx` pase al 100%.
  - *Marcas*: `//INI SPEC-001 - 04` y `//FIN SPEC-001 - 04`

- [x] **T5. Rediseño de la cuadrícula mensual y celdas en `src/components/CalendarGrid/`.** RF-3, RF-5, RF-6, CL-1, CL-2
  - *Hecho cuando*: Las 42 celdas tengan bordes sutiles, el día seleccionado destaque en terracota sólido con texto blanco, el día actual tenga indicador distinguible sin competir, y los dots de eventos tengan acabado suave con límite +N en saturación; `CalendarGrid.test.tsx` pase al 100%.
  - *Marcas*: `//INI SPEC-001 - 05` y `//FIN SPEC-001 - 05`

- [x] **T6. Rediseño del Panel de Día y botón flotante en `src/components/DayPanel/`.** RF-1, RF-2, RF-3, CL-3
  - *Hecho cuando*: Se elimine el color coral `#e06d53`, las tarjetas de eventos tengan relieve suave y truncado elegante de texto, y el botón '+' tenga acabado terracota táctil con micro-interacción; `DayPanel.test.tsx` pase al 100%.
  - *Marcas*: `//INI SPEC-001 - 06` y `//FIN SPEC-001 - 06`

- [x] **T7. Rediseño de modales y diálogos (`EventFormModal` y `ConfirmDialog`).** RF-9, RF-10, RNF-1, RNF-2
  - *Hecho cuando*: Los modales tengan backdrop con desenfoque (`backdrop-filter: blur(8px)`), inputs con sombra interna suave, anillos de foco visibles en terracota y botones de confirmación/cancelación pulidos; `EventFormModal.test.tsx` y `ConfirmDialog.test.tsx` pasen al 100%.
  - *Marcas*: `//INI SPEC-001 - 07` y `//FIN SPEC-001 - 07`

- [x] **T8. Validación integral de la spec, accesibilidad WCAG AA y verificación de suite.** RF-1 a RF-10, RNF-1 a RNF-4
  - *Hecho cuando*: Se verifiquen todos los criterios de aceptación, no existan regresiones en los 51 tests de Vitest, la compilación sea limpia y se audite la estética libre de UI Slop.
  - *Marcas*: Auditoría de cierre y reporte de validación.

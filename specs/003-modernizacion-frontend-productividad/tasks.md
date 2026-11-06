# Tareas — Spec 003: Modernización del Frontend y Productividad Reactiva (Fase A)

Checklist de ejecución atómica y secuencial (20-30 min por tarea). Cada tarea debe preservar intactas las marcas históricas (`SPEC-001` y `SPEC-002`), delimitar sus bloques con `//INI SPEC-003 - NN` y `//FIN SPEC-003 - NN` (o `/* INI SPEC-003 - NN */` en CSS) y mantener la compilación (`npm run build`) y las pruebas (`npm run test`) en verde.

- [x] **T1. Tokens de categorías en `src/index.css`, tipo `EventCategory` en `src/types/calendar.ts` y utilidades puras en `src/utils/categoryUtils.ts` con sus pruebas unitarias.** RF-1, RF-5, RNF-1, RNF-2, RNF-4
  - *Hecho cuando*:
    1. Se definan en `src/index.css` los tokens de color de alto contraste WCAG AA para las 4 categorías (`--cat-work-*`, `--cat-personal-*`, `--cat-health-*`, `--cat-important-*`) y la utilidad tipográfica tabular (`--font-tabular`).
    2. Se agregue `EventCategory = 'work' | 'personal' | 'health' | 'important'` y la propiedad opcional `category?: EventCategory` a `CalendarEvent` en `src/types/calendar.ts`.
    3. Se cree `src/utils/categoryUtils.ts` con `EVENT_CATEGORIES`, `ALL_CATEGORIES`, `resolveEventCategory`, `getCategoryMeta`, `extractStartTime` y `filterEvents`, acompañado de su suite `src/utils/categoryUtils.test.ts` pasando al 100%.
  - *Marcas*: `//INI SPEC-003 - 01` y `//FIN SPEC-003 - 01`

- [x] **T2. Soporte de categorías en validación (`src/utils/eventValidation.ts`), datos semilla (`src/mocks/events.ts`) y selector de categoría en `src/components/EventFormModal/`.** RF-5, RNF-4
  - *Hecho cuando*:
    1. `EventFormValues` y `sanitizeEvents` en `src/utils/eventValidation.ts` soporten y preserven `category?: EventCategory`.
    2. `src/mocks/events.ts` asigne las categorías oficiales (`work`, `personal`, `health`, `important`) a los eventos generados.
    3. `EventFormModal`, `EventForm` y `useEventForm` muestren un selector accesible de las 4 categorías en español (**Trabajo**, **Personal**, **Salud**, **Importante**), guarden la categoría y el color semántico correspondiente, y pasen todas las pruebas en `EventFormModal.test.tsx`.
  - *Marcas*: `//INI SPEC-003 - 02` y `//FIN SPEC-003 - 02`

- [x] **T3. Sección de filtros interactivos por categoría en `src/components/Sidebar/`.** RF-6, RF-7, RNF-1, RNF-2
  - *Hecho cuando*:
    1. `Sidebar` acepte `activeCategories` y `onToggleCategory`, renderizando debajo de los 12 meses la sección **Categorías** con los 4 interruptores (**Trabajo**, **Personal**, **Salud**, **Importante**) e indicadores de color semántico.
    2. Los contadores mensuales en `Sidebar.module.css` apliquen `font-variant-numeric: tabular-nums`.
    3. Las pruebas en `src/components/Sidebar/Sidebar.test.tsx` verifiquen la activación/desactivación de categorías y pasen al 100%.
  - *Marcas*: `//INI SPEC-003 - 03` y `//FIN SPEC-003 - 03`

- [x] **T4. Rediseño del `Header` de productividad con navegación rápida (`←`, `Hoy`, `→`) y buscador en vivo en `src/components/Header/`.** RF-8, RF-9, RNF-1, RNF-3
  - *Hecho cuando*:
    1. `Header` muestre el título dinámico del mes y año activo en español (ej. `Noviembre 2026`), los botones `Mes anterior`, `Hoy` y `Mes siguiente`, el campo de búsqueda en vivo con botón para limpiar y el botón de acción rápida para nuevo evento.
    2. Se eliminen los enlaces estáticos sin función y el avatar genérico de stock, aplicando estilos limpios en `Header.module.css`.
    3. Se validen los controles de navegación y búsqueda mediante pruebas unitarias en `src/components/Header/Header.test.tsx`.
  - *Marcas*: `//INI SPEC-003 - 04` y `//FIN SPEC-003 - 04`

- [x] **T5. Chips horizontales de eventos con hora tabular y popover flotante `+N más` en `src/components/CalendarGrid/`.** RF-1, RF-2, RF-3, RF-4, RNF-1, RNF-2, CL-1
  - *Hecho cuando*:
    1. Cada celda de las 42 casillas reemplace los puntos mudos por hasta 2 chips horizontales (`.eventChip`) con hora de inicio tabular y título truncado coloreados según su categoría, coexistiendo sin desbordamiento con la píldora ámbar de feriado nacional (`.holidayPill`).
    2. Cuando una celda tenga más de 2 eventos, muestre el botón interactivo `+N más` que al activarse abra un popover flotante accesible con la lista completa de eventos de ese día y se cierre con `Escape`, botón cerrar o clic fuera.
    3. `src/components/CalendarGrid/CalendarGrid.test.tsx` actualice y amplíe sus pruebas verificando chips, límite de 2 eventos, apertura/cierre del popover `+N más` y convivencia con feriados.
  - *Marcas*: `//INI SPEC-003 - 05` y `//FIN SPEC-003 - 05`

- [x] **T6. Rediseño del `DayPanel` como línea de tiempo estructurada con etiquetas de categoría, descripción y estado vacío orientador en `src/components/DayPanel/`.** RF-11, RF-12, RNF-1, RNF-3, CL-3
  - *Hecho cuando*:
    1. `DayPanel` proyecte los eventos del día en una línea de tiempo vertical con columna horaria en `tabular-nums`, píldora con el nombre de la categoría en español, título, descripción visible y menú de acciones.
    2. El estado vacío distinga si hay filtros/búsqueda activa (ofreciendo restablecer filtros) o si el día está libre, manteniendo el banner de feriado nacional de Spec 002 intacto.
    3. `src/components/DayPanel/DayPanel.test.tsx` valide el renderizado de categoría, descripción y estados vacíos.
  - *Marcas*: `//INI SPEC-003 - 06` y `//FIN SPEC-003 - 06`

- [x] **T7. Orquestación reactiva de filtros, buscador, navegación mensual y atajos globales de teclado (`T`, `N`, `←`, `→`) en `src/App.tsx`.** RF-7, RF-8, RF-9, RF-10, CL-2, CL-4, CL-5
  - *Hecho cuando*:
    1. `App.tsx` conecte `activeCategories` y `searchQuery` mediante `filterEvents` para alimentar reactivamente `eventCounts`, `gridCells` y `selectedDayEvents`.
    2. Se conecten los manejadores `handlePrevMonth`, `handleNextMonth`, `handleGoToToday` y `handleResetFilters` con `Header`, `Sidebar`, `CalendarGrid` y `DayPanel`.
    3. Se registren los atajos globales de teclado (`T`, `N`, `ArrowLeft`, `ArrowRight`) asegurándose de que no se disparen cuando el foco esté en un input/textarea o cuando haya un modal abierto.
  - *Marcas*: `//INI SPEC-003 - 07` y `//FIN SPEC-003 - 07`

- [x] **T8. Pruebas de integración de productividad en `src/App.test.tsx`, verificación global (`build`, `test`, `lint`) y cierre documental.** RF-1 a RF-12, RNF-1 a RNF-5
  - *Hecho cuando*:
    1. Se agreguen pruebas de integración en `src/App.test.tsx` (o suite dedicada) que comprueben el flujo completo: filtrado por categorías en vivo, búsqueda instantánea, popover `+N más` y atajos de teclado (`T`, `N`, `←`, `→`).
    2. `npm run build`, `npm run test` y `npm run lint` finalicen con 0 errores y 100% de tests en verde.
    3. Se actualice el estado de `specs/003-modernizacion-frontend-productividad/spec.md` a `implementada` y se registre el avance en `MEMORY.md`.
  - *Marcas*: `//INI SPEC-003 - 07` y actualización documental.

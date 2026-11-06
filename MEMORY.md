# MEMORY.md — Memoria Activa del Proyecto
Memoria del proyecto entre sesiones. Máximo ~60-80 líneas: resume o elimina lo que ya no aporte.

> **Fase Activa**: Spec 003 Modernización del Frontend y Productividad Reactiva (T7 completada [7/8], lista para T8).
> **Última actualización**: 6 de noviembre de 2026.

## 1. Estado Actual
- **`specs/003-modernizacion-frontend-productividad/`**: **APROBADA — EN IMPLEMENTACIÓN (7/8 TAREAS)**.
  - **T1 completada**: Tokens WCAG AAA (`--cat-*`), tipo `EventCategory`, utilidades puras en `src/utils/categoryUtils.ts` y 13 pruebas unitarias nuevas.
  - **T2 completada**: Soporte y resolución de categorías en `eventValidation.ts`, datos semilla enriquecidos en `events.ts`, selector accesible (`role="radiogroup"`) en `EventFormModal` con sincronización de color y 84/84 tests en verde.
  - **T3 completada**: Sección de filtros interactivos por categoría en `Sidebar.tsx` con 4 interruptores accesibles (`role="switch"`, `aria-checked`), puntos semánticos de color, etiquetas en español, `font-variant-numeric: tabular-nums` en badges mensuales y 88/88 tests en verde.
  - **T4 completada**: Rediseño del `Header.tsx` de productividad con título dinámico de mes y año activo (`font-variant-numeric: tabular-nums`), controles de navegación rápida (`Mes anterior`, `Hoy`, `Mes siguiente`), buscador interactivo con botón para limpiar consulta, botón de nuevo evento (`+ Nuevo [N]`), eliminación de enlaces obsoletos y avatar falso (anti-ui-slop), con 10 pruebas unitarias nuevas en `Header.test.tsx` (98/98 tests en verde).
  - **T5 completada**: Chips horizontales de eventos en cada celda de la cuadrícula (`MAX_VISIBLE_CHIPS = 2`) con hora de inicio tabular (`extractStartTime`) y título truncado coloreados según su categoría, botón interactivo `+N más`, popover flotante contextual accesible con lista completa de eventos del día, cierre por botón `×`, clic fuera o `Escape`, y edición opcional (`onEditEvent`), preservando la píldora de feriado nacional (13/13 pruebas en `CalendarGrid.test.tsx`, 104/104 tests globales en verde).
  - **T6 completada**: Rediseño de `DayPanel` como línea de tiempo estructurada con conector visual vertical, nodos y píldoras de categoría semántica en español (**Trabajo**, **Personal**, **Salud**, **Importante**), horarios en `font-variant-numeric: tabular-nums`, visualización clara de descripción si existe, menú contextual de acciones, preservación intacta del banner conmemorativo de feriados oficiales de Chile y estado vacío orientador dual (filtros activos con botón "Restablecer filtros" vs día libre con botón "Programar evento"), con 11 pruebas unitarias pasando (109/109 tests globales en verde).
  - **T7 completada**: Orquestación reactiva de filtros, buscador, navegación mensual y atajos globales de teclado (`T`, `N`, `←`, `→`) en `src/App.tsx`. Conexión de `activeCategories`, `searchQuery` y derivación mediante `filterEvents` para `eventCounts`, `gridCells` y `selectedDayEvents`. Manejadores seguros de navegación de mes/año (`handlePrevMonth`, `handleNextMonth`, `handleGoToToday`) y atajos en `keydown` con omisión si hay modales o campos editables. Incorporación de pruebas de integración en `src/App.test.tsx` (111/111 tests globales en verde).
  - Rediseño con `frontend-design`: reemplazo de puntos mudos por chips reales de eventos con hora tabular y título, y popover flotante `+N más`.
  - 4 categorías oficiales en español (*Trabajo*, *Personal*, *Salud*, *Importante*) con filtro reactivo en vivo en Sidebar.
  - Header de productividad con navegación rápida (`←`, `Hoy`, `→`), buscador en vivo y atajos de teclado (`T`, `N`, `←`, `→`).
  - Agenda del día como línea de tiempo estructurada con hora tabular y descripción visible.
- **`specs/002-feriados-chile/`**: **CERRADA E IMPLEMENTADA (7/7)**.
  - Integración nativa de feriados oficiales de Chile (`https://privados.cl/apiholidays/public/CL/{YEAR}`).
  - Consulta y sincronización dinámica por año (ej. 2026, 2027) con almacenamiento en `localStorage` (`holidays-CL-{year}`).
  - Proyección en cuadrícula mensual con fondo ámbar cálido suave (`.holidayCell`), píldora sutil y tooltip accesible.
  - Banner festivo en `DayPanel` y flujo QA e2e de 3 eventos verificado (67 tests pasando en Vitest).
- **`specs/001-rediseno-visual-anti-ui-slop/`**: **CERRADA E IMPLEMENTADA**.
  - Estética unificada Soft UI / Neumorfismo suave con acento terracota (`#c85a32`).
  - Eliminados degradados verdes y barra morada lila.
  - Soporte de layout móvil mediante drawers colapsables.
  - 8/8 tareas verificadas al 100% con tests en verde.
- **Base del Calendario**: **CERRADA, APROBADA Y OPERATIVA**.
  - Cuadrícula fija de 42 celdas por mes (6 semanas completas) con lunes como inicio de semana (`src/components/CalendarGrid/`).
  - Navegación anual y mensual vertical con contador de eventos activos en Sidebar (`src/components/Sidebar/`).
  - Panel lateral de día con lista de eventos, creación rápida, edición y borrado (`src/components/DayPanel/`).
  - Modal accesible para creación/edición con validación de horarios (`src/components/EventFormModal/`).
  - Diálogo de confirmación para acciones destructivas (`src/components/ConfirmDialog/`).

## 2. Decisiones Técnicas Clave
- **Localización Global Dayjs**: Configurado en locale `'es'` con inicio de semana en lunes (`weekStart: 1`).
- **Estilos con CSS Modules**: Cada componente posee su propio archivo `.module.css`.
- **Caché de Feriados**: Clave `holidays-CL-{year}` en `localStorage`. Petición con `fetch` nativo (sin dependencias extra).
- **Control de Concurrencia**: `AbortController` en `App.tsx` para descartar peticiones desfasadas durante cambios rápidos de año.
- **Disciplina de Marcas de Auditoría**: Delimitación obligatoria `//INI SPEC-XXX` y `//FIN SPEC-XXX`, preservando bloques históricos.

## 3. Calidad y Verificación
- **Compilación**: Limpia y sin advertencias con `npm run build` (TypeScript + Vite en ~1s).
- **Pruebas**: 13 suites de prueba con 111 tests unitarios e integrados pasando al 100% con `npm run test`.
- **Linter**: `oxlint` configurado para análisis estático veloz (0 errores).

## 4. Próximos Pasos
- Atender nuevas peticiones o especificaciones del usuario (ej. categorías dinámicas, exportación de eventos, etc.).

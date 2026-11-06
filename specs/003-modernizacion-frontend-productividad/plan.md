# Plan Técnico — Spec 003: Modernización del Frontend y Productividad Reactiva (Fase A)

## 1. Proceso de Diseño en Dos Pasadas (`frontend-design`)

Siguiendo la metodología de `frontend-design` y `anti-ui-slop`, el diseño visual y estructural se define en dos pasadas antes de tocar código:

### Pasada 1: Sistema de Tokens, Tipografía, Layout y Principios

#### A. Paleta Semántica y Tokens de Color (`src/index.css`)
Mantenemos el lienzo cálido piedra/lino (`#f4f3ef`) y el acento terracota (`#c85a32`) de Spec 001/002, e introducimos un sistema cromático de **4 categorías** diseñado específicamente para alto contraste (**WCAG AA >= 4.5:1**) sobre superficies claras y distinción inmediata frente al ámbar festivo de los feriados:

| Categoría (ID) | Etiqueta UI | Fondo del Chip (`--cat-*-bg`) | Texto / Borde Fuerte (`--cat-*-text`) | Punto / Indicador (`--cat-*-dot`) | Contraste Texto/Fondo |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `work` | **Trabajo** | `#e8f1f8` (Azul pizarra suave) | `#1e4e79` (Azul marino profundo) | `#2b6cb0` | **7.4 : 1** (AAA) |
| `personal` | **Personal** | `#eaf5ee` (Salvia suave) | `#1b5e3a` (Verde bosque) | `#2f855a` | **6.9 : 1** (AAA) |
| `health` | **Salud** | `#f3eef8` (Lavanda mineral) | `#55307d` (Ciruela profundo) | `#6b46c1` | **7.8 : 1** (AAA) |
| `important` | **Importante** | `#fdecec` (Coral pálido) | `#9b1c1c` (Carmesí oscuro) | `#c53030` | **7.6 : 1** (AAA) |

*Nota sobre Feriados (Spec 002)*: Los feriados conservan su identidad exclusiva en **Ámbar Cálido / Terracota** (`#fff8f0` / `#9a3412`), por lo que ninguna categoría de usuario colisiona con el color oficial de los festivos nacionales.

#### B. Tipografía y Disciplina Numérica
- Familia base: Sans-serif de sistema optimizada para interfaces densas (`system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif`).
- **Regla Tabular (`--font-tabular`)**: Se aplica `font-variant-numeric: tabular-nums` en:
  - Horas de los chips en celdas (`09:30`).
  - Bloques horarios de la línea de tiempo en `DayPanel` (`09:30 - 10:30`).
  - Números de día (`1`..`31`), año (`2026`), badges de conteo mensual y botón `+N más`.
- Sin textos en `ALL CAPS` decorativos innecesarios: los nombres de categorías y controles usan *Sentence case* claro (`Trabajo`, `Personal`, `Salud`, `Importante`).

#### C. Concepto de Layout y Wireframes ASCII
Estructura de 3 columnas en escritorio (Sidebar 248px | Centro elástico con Header de Productividad + Grid 7x6 | DayPanel 330px con Línea de Tiempo):

```text
+--------------------------------------------------------------------------------------------------+
| Sidebar (248px)      | Header: [Noviembre 2026] [<-] [Hoy] [->]   [ 🔍 Buscar eventos... [x] ]   |
|----------------------|---------------------------------------------------------------------------|
| [<] 2026 [>]         | LUN          MAR          MIÉ          JUE          VIE      SÁB     DOM  |
|                      |---------------------------------------------------------------------------|
| Enero             12 | 26           27           28           29           30       31      1    |
| ...                  |                           07:00 Tenis  09:30 Jorna..                 ★Fer |
| ● Noviembre       24 |                           10:30 Reuni..14:30 Revis..                 08:30|
| Diciembre         18 |                           +1 más                                          |
|                      |---------------------------------------------------------------------------|
| Categorías           | ... (6 semanas fijas = 42 celdas exactas con overflow controlado)         |
| [✓] ● Trabajo        |                                                                           |
| [✓] ● Personal       |                                           +-------------------------------+
| [✓] ● Salud          |                                           | Popover (+1 más - 28 Nov) [x] |
| [✓] ● Importante     |                                           | • 07:00 Partido de Tenis      |
|                      |                                           | • 10:30 Reunión Clientes      |
|                      |                                           | • 19:30 Salida con Amigos     |
+----------------------+-------------------------------------------+-------------------------------+
```

**Detalle del `DayPanel` (Línea de Tiempo Vertical)**:
```text
+---------------------------------------+
| 28 de noviembre                       |
| Sábado                                |
|---------------------------------------|
| 07:00   | [Salud]                     |
| 08:15   | Partido de Tenis en el Club |
|         | Entrenamiento matutino...   |
|         |                         [⋮] |
|---------+-----------------------------|
| 13:30   | [Personal]                  |
| 16:30   | Almuerzo Familiar           |
|         | Reunión con padres...   [⋮] |
+---------------------------------------+
```

### Pasada 2: Crítica contra Clichés de IA (`anti-ui-slop`) y Refinamiento
- **Crítica 1**: En el Header actual (`Spec 001`), existían enlaces estáticos (`#hoy`, `#calendario`, `#organizar`) y un avatar genérico de stock (Unsplash) que no cumplían ninguna función real en la aplicación (típico *template chrome* de IA).
  - **Corrección**: Se eliminan el avatar falso y los enlaces muertos. El `Header` pasa a ser una barra de herramientas 100% funcional con el título dinámico del mes/año (`Noviembre 2026`), el grupo de botones táctiles (`←`, `Hoy`, `→`), el buscador reactivo en vivo con botón para limpiar y un indicador discreto de atajos (`T`, `N`).
- **Crítica 2**: Mostrar 3 o 4 chips dentro de una celda más la píldora de feriado rompería la altura fija de `1fr` en las 6 filas de la cuadrícula.
  - **Corrección**: El límite estricto visible por celda se fija en **máximo 2 chips de evento** (`MAX_VISIBLE_EVENTS = 2`). Si hay más de 2 eventos (ej. 3 eventos), se muestran los primeros 2 chips y el botón compacto `+1 más`. Si el día además es feriado nacional, la píldora ámbar ocupa la cabecera junto al número de día y los 2 chips + botón `+N más` se mantienen compactos (`padding: 1px 5px`, `font-size: 0.68rem`), garantizando **cero saltos de altura**.

---

## 2. Arquitectura por Capa y Componentes

### 2.1. Tipos de Dominio (`src/types/calendar.ts`)
- Se define el tipo unión `EventCategory = 'work' | 'personal' | 'health' | 'important'`.
- Se extiende `CalendarEvent` agregando `category?: EventCategory`.

### 2.2. Utilidades de Categorías y Retrocompatibilidad (`src/utils/categoryUtils.ts`)
Módulo puro con:
- `EVENT_CATEGORIES`: Diccionario y arreglo ordenado con metadatos de las 4 categorías (`id`, `label` en español, `color`, `bgVar`, `textVar`, `dotVar`).
- `DEFAULT_CATEGORY: EventCategory = 'work'`.
- `ALL_CATEGORIES: EventCategory[] = ['work', 'personal', 'health', 'important']`.
- `resolveEventCategory(event: Pick<CalendarEvent, 'category' | 'color' | 'title'>): EventCategory`:
  - Si `event.category` es una de las 4 válidas, la retorna directamente.
  - Si es un evento legado (de `localStorage` previo o `mockEvents`), infiere la categoría de forma determinista según su `color` o palabras clave del título:
    - Verde (`#2ecc71`) -> `'health'` (**Salud**)
    - Azul (`#3498db`) o Morado (`#9b59b6`) -> `'work'` (**Trabajo**)
    - Rojo (`#e74c3c`) -> `'important'` (**Importante**)
    - Naranja (`#f39c12`), Turquesa (`#1abc9c`), Rosa (`#e84393`) -> `'personal'` (**Personal**)
    - Por defecto -> `'work'`.
- `getCategoryMeta(category?: EventCategory)`: Devuelve `{ id, label, color, bgVar, textVar, dotVar }`.
- `extractStartTime(time?: string): string | null`: Extrae la hora inicial `HH:mm` de cadenas como `'09:30 - 13:00'` o `'09:30'` para mostrarla limpia en el chip de la celda (retorna `null` si es `'Todo el día'` o vacío).
- `filterEvents(events: CalendarEvent[], activeCategories: EventCategory[], searchQuery: string): CalendarEvent[]`:
  - Normaliza `searchQuery` (minúsculas y sin diacríticos vía `.normalize('NFD').replace(/[\u0300-\u036f]/g, '')`).
  - Filtra en una sola pasada por pertenencia a `activeCategories` y coincidencia en `title` o `description`.

### 2.3. Actualización de Validación y Mocks (`src/utils/eventValidation.ts` y `src/mocks/events.ts`)
- En `eventValidation.ts`:
  - `EventFormValues` añade `category: EventCategory`.
  - `sanitizeEvents` acepta `category` opcional validando que sea un `EventCategory` válido o resolviéndolo con `resolveEventCategory`.
- En `src/mocks/events.ts`:
  - Se enriquece la generación de mocks asignando explícitamente `category: 'health' | 'work' | 'personal' | 'important'` a cada plantilla para que los filtros por categoría operen con riqueza desde la primera carga.

### 2.4. Formulario Modal con Selector de Categoría (`src/components/EventFormModal/`)
- En `EventFormModal.tsx`, `EventForm.tsx` y `useEventForm.ts`:
  - Se inicializa `category: event ? resolveEventCategory(event) : 'work'`.
  - Se añade un grupo accesible de selección de categoría (`role="radiogroup"`, `aria-label="Categoría del evento"`) con 4 píldoras interactivas (**Trabajo**, **Personal**, **Salud**, **Importante**).
  - Al guardar, `onSave` incluye `category: values.category` y sincroniza `color` con el color semántico de la categoría seleccionada para mantener compatibilidad total.

### 2.5. Sidebar con Filtros de Categorías en Vivo (`src/components/Sidebar/`)
- Nuevas props opcionales en `SidebarProps` (opcionales con valores por defecto para no romper tests existentes):
  - `activeCategories?: EventCategory[]`
  - `onToggleCategory?: (category: EventCategory) => void`
- Debajo de la lista de los 12 meses, se renderiza la sección **Categorías** con los 4 botones tipo filtro (`role="switch"` o `aria-pressed`), punto de color semántico y etiqueta en español (**Trabajo**, **Personal**, **Salud**, **Importante**).

### 2.6. Header de Productividad y Buscador en Vivo (`src/components/Header/`)
- Nuevas props opcionales en `HeaderProps` (con defaults para retrocompatibilidad con tests unitarios previos):
  - `currentMonthIndex?: number`
  - `currentYear?: number`
  - `searchQuery?: string`
  - `onSearchChange?: (query: string) => void`
  - `onPrevMonth?: () => void`
  - `onNextMonth?: () => void`
  - `onToday?: () => void`
  - `onNewEvent?: () => void`
- Estructura visual:
  - Izquierda: Icono + Marca **Calendario**, separador vertical sutil y título dinámico del mes y año (`Noviembre 2026`) con `tabular-nums`.
  - Centro: Controles de navegación rápida: botón `←` (`aria-label="Mes anterior"`), botón `Hoy` (`aria-label="Ir a hoy"`), botón `→` (`aria-label="Mes siguiente"`).
  - Derecha: Campo de búsqueda (`type="search"`, `placeholder="Buscar eventos..."`, `aria-label="Buscar eventos"`) con botón `×` para limpiar cuando hay texto, y botón compacto `+ Nuevo` con hint de tecla `N`.

### 2.7. Cuadrícula Mensual con Chips y Popover `+N más` (`src/components/CalendarGrid/`)
- En cada celda (`DayCell`):
  - La cabecera de celda `.cellHeader` se organiza en una fila horizontal compacta (`display: flex; justify-content: space-between; align-items: center`) donde conviven el número del día (`.dayNumber`) y la píldora de feriado (`.holidayPill`) truncada.
  - Cuerpo de eventos `.eventsList`:
    - Muestra hasta `MAX_VISIBLE_EVENTS = 2` chips (`.eventChip`).
    - Cada `.eventChip` aplica variables o clases según `resolveEventCategory(event)` y muestra:
      - `<span className={styles.chipTime}>{startTime}</span>` (si tiene hora de inicio) en `tabular-nums`.
      - `<span className={styles.chipTitle}>{event.title}</span>` truncado con `text-overflow: ellipsis`.
    - Si `cell.events.length > 2`, renderiza `<button type="button" className={styles.moreBtn}>+{cell.events.length - 2} más</button>` con `e.stopPropagation()` para abrir el popover de esa fecha y seleccionar el día.
- **Popover Flotante Contextual (`.morePopover`)**:
  - Estado local `openPopoverDate: string | null` en `CalendarGrid`.
  - Cuando `openPopoverDate === cell.date` (o renderizado como diálogo flotante contextual dentro del contenedor de la cuadrícula con `role="dialog"` y `aria-label="Eventos del día ..."`):
    - Muestra el título formateado de la fecha (ej. `28 de noviembre`), botón `Cerrar` (`×`), y la lista completa de eventos de esa celda con su hora tabular, chip de categoría, título completo y clic directo para seleccionar el día o editar el evento (`onEditEvent?: (event: CalendarEvent) => void`).
    - Se cierra al pulsar `Escape` (con `e.stopPropagation()`) o al hacer clic fuera del popover.

### 2.8. Agenda del Día con Línea de Tiempo (`src/components/DayPanel/`)
- Nuevas props opcionales en `DayPanelProps`:
  - `hasActiveFilters?: boolean`
  - `onResetFilters?: () => void`
- Rediseño de `.eventList` como línea de tiempo (`.timelineList`):
  - Cada ítem (`.timelineItem`) presenta:
    - Columna horaria izquierda (`.timeColumn`) con `tabular-nums` mostrando la hora de inicio y fin apiladas o `Todo el día`, acompañada de una línea guía vertical y nodo del color de la categoría.
    - Tarjeta de contenido (`.eventCard`) con borde izquierdo semántico de categoría, badge de categoría en español (`Trabajo`, `Personal`, `Salud`, `Importante`), título del evento, descripción (`.eventDescription`, si existe) y el menú `EventActionsMenu`.
- Estado vacío orientador (`.emptyState`):
  - Si no hay eventos y `hasActiveFilters` es `true`, informa: *"No hay eventos que coincidan con tu búsqueda o filtros activos."* y ofrece un botón *"Restablecer filtros"*.
  - Si no hay eventos en absoluto para ese día, informa: *"No hay eventos programados para este día."* y ofrece un botón secundario *"Programar evento"*.

### 2.9. Orquestación y Atajos de Teclado en `src/App.tsx`
- Nuevos estados en `App.tsx`:
  - `activeCategories`: `useState<EventCategory[]>(ALL_CATEGORIES)`
  - `searchQuery`: `useState<string>('')`
- Evento filtrado memorizado:
  - `filteredEvents = useMemo(() => filterEvents(events, activeCategories, searchQuery), [events, activeCategories, searchQuery])`
  - `eventCounts`, `gridCells` y `selectedDayEvents` pasan a calcularse a partir de `filteredEvents`, logrando reactividad instantánea en toda la interfaz.
- Navegación de mes anterior / siguiente / hoy:
  - `handlePrevMonth`: usa `dayjs(new Date(currentYear, currentMonthIndex, 1)).subtract(1, 'month')` para actualizar mes y año sin errores de borde.
  - `handleNextMonth`: usa `.add(1, 'month')`.
  - `handleGoToToday`: fija `currentYear`, `currentMonthIndex` y `selectedDateStr` al día actual (`dayjs()`).
- Listener global de atajos de teclado (`useEffect`):
  - Verifica que el evento no provenga de `INPUT`, `TEXTAREA`, `SELECT` ni `isContentEditable`, y que `!isEventModalOpen && deletingEvent === null`.
  - `t` / `T` -> `handleGoToToday()`
  - `n` / `N` -> `e.preventDefault(); setEditingEvent(null); setIsEventModalOpen(true);`
  - `ArrowLeft` -> `handlePrevMonth()`
  - `ArrowRight` -> `handleNextMonth()`

---

## 3. Decisiones Técnicas y Alternativas Descartadas (Ponytail)

1. **Filtrado derivado con `useMemo` vs Estado duplicado o Context complejo**:
   - *Decisión*: Derivar `filteredEvents` en `App.tsx` mediante `useMemo` a partir de `events`, `activeCategories` y `searchQuery`.
   - *Alternativa descartada*: Instalar Zustand/Redux o duplicar arreglos de eventos filtrados en `useState`. `useMemo` sobre ~1.000 eventos anuales tarda < 1 ms y evita desincronizaciones.
2. **Popover nativo ligero en React vs Librería `@floating-ui/react` o `radix-ui`**:
   - *Decisión*: Implementar el popover de `+N más` con posicionamiento CSS limpio y listener de cierre (`Escape` + `mousedown` exterior) en `CalendarGrid`, sin añadir dependencias externas a `package.json`.
   - *Alternativa descartada*: Instalar `@floating-ui/react` (viola la restricción de no agregar dependencias sin necesidad crítica).
3. **Inferencia automática de categoría (`resolveEventCategory`) vs Migración destructiva de `localStorage`**:
   - *Decisión*: Resolver la categoría al vuelo si un evento antiguo solo tiene `color`, y persistir `category` cuando se cree o edite.
   - *Alternativa descartada*: Borrar el `localStorage` del usuario al actualizar la versión, lo cual destruiría eventos creados previamente.

---

## 4. Estrategia de Pruebas y Verificación (`Vitest` + `React Testing Library`)

1. **`src/utils/categoryUtils.test.ts` (Nuevo)**:
   - Verifica `resolveEventCategory` para las 4 categorías explícitas y la inferencia por color en eventos legados.
   - Verifica `extractStartTime` con rangos `'09:30 - 11:00'`, horas simples `'08:00'` y `'Todo el día'`.
   - Verifica `filterEvents` combinando filtro de categorías + búsqueda de texto con tildes/mayúsculas.
2. **`src/components/CalendarGrid/CalendarGrid.test.tsx` (Actualizado)**:
   - Verifica que se rendericen chips con hora y título del evento en lugar de solo puntos mudos.
   - Verifica que con > 2 eventos se muestren máximo 2 chips y el botón `+N más`.
   - Verifica que al hacer clic en `+N más` se abra el popover con todos los eventos del día y se cierre con `Escape`.
   - Verifica convivencia entre píldora de feriado (`holiday-pill`) y chips de eventos.
3. **`src/components/Sidebar/Sidebar.test.tsx` (Actualizado)**:
   - Verifica el renderizado de los 4 filtros de categoría (**Trabajo**, **Personal**, **Salud**, **Importante**) y el disparo de `onToggleCategory`.
4. **`src/components/Header/Header.test.tsx` (Nuevo / Actualizado)**:
   - Verifica la visualización del mes/año activo, botones `Mes anterior`, `Hoy`, `Mes siguiente` y el funcionamiento del buscador en vivo.
5. **`src/components/DayPanel/DayPanel.test.tsx` y `EventFormModal.test.tsx` (Actualizados)**:
   - Verifica la línea de tiempo con etiqueta de categoría en español, descripción visible y selector de categorías en el modal.
6. **`src/App.test.tsx` (Integración)**:
   - Verifica filtrado en vivo por categoría, búsqueda en tiempo real y atajos de teclado (`T`, `N`, `←`, `→`).

---

## 5. Matriz de Trazabilidad (RF -> Componentes)

| Componente / Módulo | Requisitos Cubiertos | Marcas de Auditoría |
| :--- | :--- | :--- |
| `src/types/calendar.ts`, `src/utils/categoryUtils.ts`, `src/index.css` | RF-1, RF-5, RNF-1, RNF-2, RNF-4 | `SPEC-003 - 01` |
| `src/mocks/events.ts`, `src/utils/eventValidation.ts`, `src/components/EventFormModal/` | RF-5, RNF-4 | `SPEC-003 - 02` |
| `src/components/Sidebar/` | RF-6, RF-7, CL-3 | `SPEC-003 - 03` |
| `src/components/Header/` | RF-8, RF-9 | `SPEC-003 - 04` |
| `src/components/CalendarGrid/` | RF-1, RF-2, RF-3, RF-4, CL-1 | `SPEC-003 - 05` |
| `src/components/DayPanel/` | RF-11, RF-12, CL-3 | `SPEC-003 - 06` |
| `src/App.tsx` | RF-7, RF-8, RF-9, RF-10, CL-2, CL-4, CL-5 | `SPEC-003 - 07` |

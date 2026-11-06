# Plan Técnico — Spec 001: Rediseño Visual Profesional (Anti-UI Slop)

## 1. Resumen de la Solución
Este plan define la transformación técnica de la interfaz de **Antigravity Calendar** para implementar una estética **Soft UI moderno / Neumorfismo suave** con acentos en terracota/ámbar cálido, tipografía de sistema afinada y adaptabilidad móvil mediante paneles colapsables.

Se reemplaza el gradiente verde oscuro, el lila del Sidebar y el coral del DayPanel por un sistema unificado de tokens CSS globales en `src/index.css` y módulos CSS locales (`.module.css`), sin agregar dependencias externas (disciplina Ponytail).

---

## 2. Sistema de Tokens Globales (`src/index.css`)
Se introduce un diccionario centralizado de tokens CSS en `:root` para consumo en todos los módulos CSS:

```css
:root {
  /* Fondos y Superficies Soft UI */
  --bg-canvas: #f4f3ef;            /* Fondo base cálido piedra/lino */
  --bg-surface: #fcfbf9;           /* Superficies secundarias */
  --bg-surface-elevated: #ffffff;  /* Tarjetas y modales principales */
  --bg-subtle: #eeece6;            /* Hover suave, inputs y fondos tenues */
  
  /* Bordes */
  --border-subtle: rgba(40, 36, 33, 0.07);
  --border-strong: rgba(40, 36, 33, 0.14);
  
  /* Acento Principal: Terracota / Ámbar Cálido */
  --accent-primary: #c85a32;       /* Terracota cálido (contraste > 4.5:1 con blanco) */
  --accent-hover: #b04c27;
  --accent-light: rgba(200, 90, 50, 0.12);
  --accent-contrast: #ffffff;
  
  /* Jerarquía de Texto (Carbón Cálido) */
  --text-primary: #252321;         /* Títulos y texto de alto contraste */
  --text-secondary: #6b6660;       /* Subtítulos y metadatos */
  --text-tertiary: #a19c94;        /* Días fuera de mes y placeholders */
  
  /* Sombras Táctiles Multicapa */
  --shadow-soft-sm: 0 2px 6px -1px rgba(37, 35, 33, 0.05), 0 4px 12px -2px rgba(37, 35, 33, 0.04);
  --shadow-soft-md: 0 6px 18px -3px rgba(37, 35, 33, 0.07), 0 12px 28px -4px rgba(37, 35, 33, 0.06);
  --shadow-soft-lg: 0 18px 40px -8px rgba(37, 35, 33, 0.09), 0 26px 65px -10px rgba(37, 35, 33, 0.08);
  --shadow-inset: inset 0 2px 4px rgba(0, 0, 0, 0.05);
  
  /* Radios Suaves */
  --radius-sm: 8px;
  --radius-md: 14px;
  --radius-lg: 20px;
  --radius-xl: 26px;
}
```

---

## 3. Arquitectura y Componentes Afectados

### Capa 1: Estructura Global y Layout (`src/App.tsx`, `src/App.module.css`, `src/index.css`)
- **Tokens y Tipografía**: Actualizar `src/index.css` con la pila tipográfica de sistema y los tokens `:root`.
- **Contenedor Principal (`App.module.css`)**:
  - Reemplazar el degradado verde por `background-color: var(--bg-canvas)`.
  - La tarjeta `.calendarCard` pasa a tener `background: var(--bg-surface-elevated)`, borde suave `--border-subtle`, esquinas `var(--radius-xl)` y sombra multicapa `var(--shadow-soft-lg)`.
- **Adaptabilidad Móvil (`App.tsx`)**:
  - Agregar estado local `sidebarOpen` y `dayPanelOpen` para pantallas pequeñas (< 768px).
  - Incluir botones de apertura en el Header cuando esté en vista móvil y backdrop accesible para cerrarlos.
  - Cubre: **RF-1, RF-2, RF-4, RF-7, RF-8, RNF-3, RNF-4**.

### Capa 2: Barra Lateral (`src/components/Sidebar/`)
- **Estilos (`Sidebar.module.css`)**:
  - Eliminar el color morado `#7b68ee`.
  - Fondo `var(--bg-surface)` con borde divisorio `var(--border-subtle)`.
  - Selector de año con botones táctiles redondeados y sombra sutil al hacer hover.
  - Lista de meses: mes activo destacado con fondo `var(--accent-light)` y texto `var(--accent-primary)` con tipografía semibold. Contador de eventos con cápsula redondeada.
  - En responsive móvil: transformarse en un drawer lateral desplegable con animación suave (`transform: translateX`).
  - Cubre: **RF-1, RF-2, RF-3, RF-8, RNF-1, RNF-2**.

### Capa 3: Cuadrícula Mensual (`src/components/CalendarGrid/`)
- **Estilos y Celdas (`CalendarGrid.module.css`)**:
  - Fondo limpio de cuadrícula con bordes suaves entre celdas.
  - Días de la semana (LUN-DOM) en mayúsculas sutiles, tamaño 0.75rem, `letter-spacing: 0.08em` y color `var(--text-secondary)`.
  - Celda de día: esquinas suaves (radio 10px), hover con elevación suave `var(--shadow-soft-sm)`.
  - Día seleccionado (`isSelected`): fondo `var(--accent-primary)`, texto blanco, sombra táctil en terracota.
  - Día actual (`isToday`): anillo sutil terracota o badge indicador que no compita con la selección.
  - Días fuera de mes (`isCurrentMonth: false`): atenuados con `var(--text-tertiary)`.
  - Indicadores de eventos (dots): puntos suaves con margen y contador de desborde (+N) si superan 3 eventos.
  - Cubre: **RF-3, RF-5, RF-6, CL-1, CL-2, RNF-1**.

### Capa 4: Panel del Día (`src/components/DayPanel/`)
- **Estilos (`DayPanel.module.css`)**:
  - Eliminar el color coral `#e06d53`.
  - Encabezado con número de fecha grande en `var(--text-primary)` y día de la semana en `var(--accent-primary)`.
  - Tarjetas de eventos del día: fondo `var(--bg-surface)`, esquinas redondeadas (12px), barra lateral de acento de categoría, truncado elegante para títulos extensos.
  - Botón flotante `+` para nuevo evento: acabado en terracota `var(--accent-primary)` con sombra difusa y efecto táctil al pulsar (`active: scale(0.96)`).
  - En responsive móvil: soporte de drawer lateral o inferior deslizable.
  - Cubre: **RF-1, RF-2, RF-3, RF-8, CL-3, RNF-1**.

### Capa 5: Modales y Diálogos (`src/components/EventFormModal/`, `src/components/ConfirmDialog/`)
- **Estilos (`EventFormModal.module.css`, `ConfirmDialog.module.css`)**:
  - Backdrop con desenfoque `backdrop-filter: blur(8px)` y fondo oscurecido sutil `rgba(35, 33, 31, 0.4)`.
  - Ventana modal con `var(--radius-lg)` (20px), sombra multicapa `var(--shadow-soft-lg)` y borde `var(--border-subtle)`.
  - Inputs de formulario con esquinas redondeadas, fondo `var(--bg-subtle)` y foco con anillo terracota.
  - Botones de acción: "Guardar" en terracota suave, "Cancelar" en neutro suave con micro-relieve táctil.
  - Diálogo de confirmación accesible con textos claros en español.
  - Cubre: **RF-9, RF-10, RNF-1, RNF-2**.

---

## 4. Estrategia de Pruebas y Verificación
1. **Verificación Visual y Funcional**:
   - Compilación con `npm run build` sin advertencias de tipos ni Vite.
   - Verificación de contraste cromático WCAG AA en textos contra fondos (> 4.5:1).
   - Navegación por teclado (`Tab`, `Shift+Tab`, `Enter`, `Escape`) en celdas, modales y botones.
2. **Suite de Pruebas Automatizadas (Vitest)**:
   - Ejecución de `npm run test` confirmando que las 10 suites (51 tests) se mantienen en verde.
   - Si se agregan botones de drawer en móvil, asegurar que los tests de `App.test.tsx`, `Sidebar.test.tsx` y `DayPanel.test.tsx` continúen encontrando los elementos por sus roles semánticos existentes.
3. **Marcas de Auditoría**:
   - Todo bloque modificado contendrá obligatoriamente marcas `//INI SPEC-001 - NN` y `//FIN SPEC-001 - NN`.

---

## 5. Fases de Implementación (Orden Atómico)
- **Fase 1**: Tokens globales Soft UI y tipografía en `src/index.css`.
- **Fase 2**: Contenedor principal y layout adaptable en `src/App.module.css` y `src/App.tsx`.
- **Fase 3**: Rediseño de Sidebar en `src/components/Sidebar/`.
- **Fase 4**: Rediseño de Cuadrícula Mensual y celdas en `src/components/CalendarGrid/`.
- **Fase 5**: Rediseño de Panel de Día y botón flotante en `src/components/DayPanel/`.
- **Fase 6**: Rediseño de Modales (`EventFormModal` y `ConfirmDialog`).
- **Fase 7**: Auditoría de accesibilidad, validación móvil y verificación de tests.

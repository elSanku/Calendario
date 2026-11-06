# Plan Paso a Paso: Construcción de la Aplicación de Calendario

## 1. Visión y Requerimientos de Diseño
- **Herramientas**: Vite CLI, React 18+, TypeScript.
- **Estilos**: CSS Modules o CSS simple, responsive design limpio sin sobrecarga de dependencias.
- **Librería de utilidades de fecha**: `dayjs` (configurado en español `'es'`).
- **Iconografía**: `lucide-react`.
- **Composición Visual**:
  - **Sidebar (Estilo Captura 2)**: Columna lateral morada/lila con selector de año (`< 2026 >`), lista vertical de los 12 meses (Enero a Diciembre) con sus respectivos contadores de eventos a la derecha.
  - **Header (Estilo Captura 1)**: Logo "CLDR" / Calendario a la izquierda, navegación central, usuario y avatar a la derecha.
  - **Cuadrícula Central (Estilo Captura 1)**:
    - Cabecera de días de la semana (LUN, MAR, MIÉ, JUE, VIE, SÁB, DOM) - Inicio en Lunes.
    - Cuadrícula de 6 semanas (42 celdas) por mes.
    - Días pertenecientes al mes anterior/siguiente en tono atenuado.
    - Día seleccionado con fondo destacado (estilo teal/verde de Captura 1).
    - Puntos indicadores (dots) de colores si el día contiene eventos.
  - **Panel de Detalle del Día (Estilo Captura 1)**:
    - Encabezado con fecha en grande (ej. "OCTUBRE 29" y día de la semana).
    - Lista de eventos del día seleccionado con título, horario y botón de opciones `...`.
    - Botón flotante circular `+` en la esquina inferior derecha.

---

## 2. Estructura de Directorios a Crear
```
antigravity-calendar/
├── public/
├── src/
│   ├── assets/              # Iconos o imágenes
│   ├── components/
│   │   ├── Header/          # Barra superior estilo CLDR
│   │   │   ├── Header.tsx
│   │   │   └── Header.module.css
│   │   ├── Sidebar/         # Selector de año + lista de meses con contadores
│   │   │   ├── Sidebar.tsx
│   │   │   └── Sidebar.module.css
│   │   ├── CalendarGrid/    # Grilla de 6 semanas con días y dots
│   │   │   ├── CalendarGrid.tsx
│   │   │   └── CalendarGrid.module.css
│   │   └── DayPanel/        # Panel lateral con agenda y botón +
│   │       ├── DayPanel.tsx
│   │       └── DayPanel.module.css
│   ├── mocks/
│   │   └── events.ts        # Eventos iniciales de prueba
│   ├── types/
│   │   └── calendar.ts      # Interfaces CalendarEvent, MonthInfo, etc.
│   ├── utils/
│   │   └── dateUtils.ts     # Generador de grilla de 42 días, cálculos y nombres en español
│   ├── App.tsx              # Componente principal y estado compartido
│   ├── App.module.css       # Layout general (Grid/Flex responsivo)
│   ├── index.css            # Reseteo básico y variables de color
│   └── main.tsx             # Punto de entrada React
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## 3. Fases Paso a Paso

### Paso 1: Inicialización del Proyecto con Vite CLI
1. Ejecutar inicialización de Vite con plantilla `react-ts`.
2. Instalar dependencias de producción: `dayjs`, `lucide-react`.
3. Configurar `vite.config.ts` y limpiar archivos sobrantes o redundantes (`calendar.js`, `helpers.js`).

### Paso 2: Modelo de Datos y Utilidades de Fecha (`types/` y `utils/`)
1. Definir la interfaz TypeScript:
   ```typescript
   export interface CalendarEvent {
     id: string;
     title: string;
     date: string; // Formato 'YYYY-MM-DD'
     time?: string;
     description?: string;
     color?: string; // Para los dots de colores
   }
   ```
2. Crear funciones auxiliares en `src/utils/dateUtils.ts`:
   - Configurar `dayjs` con locale en español (`dayjs.locale('es')`).
   - Función para generar la cuadrícula de 42 días (6 semanas exactas) iniciando en Lunes.
   - Función para contar eventos por mes para un año determinado.
   - Formateadores amigables para el encabezado del panel de día.

### Paso 3: Datos de Prueba (`src/mocks/events.ts`)
1. Crear una colección de eventos distribuidos a lo largo del año actual para alimentar tanto los contadores del Sidebar como los dots de la cuadrícula y el panel diario.

### Paso 4: Implementación de Componentes
1. **`Sidebar`**:
   - Botones `<` y `>` para decrementar e incrementar el año activo.
   - Renderizar los 12 meses con el conteo de eventos de cada uno.
   - Resaltar el mes actualmente seleccionado y emitir el cambio al hacer clic.
2. **`Header`**:
   - Logotipo a la izquierda ("CLDR" / Calendario).
   - Menú de opciones ("Hoy", "Calendario", "Organizar").
   - Perfil de usuario con avatar a la derecha.
3. **`CalendarGrid`**:
   - Cabecera: `['LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB', 'DOM']`.
   - Celdas con número de día, clase atenuada para días de meses adyacentes.
   - Indicadores visuales (puntos de colores) según los eventos que coincidan con la fecha `YYYY-MM-DD`.
   - Celda seleccionada resaltada en bloque color.
4. **`DayPanel`**:
   - Vista de fecha: Nombre del mes y número de día (ej: "OCTUBRE 29") y nombre del día de la semana.
   - Lista scrolleable de eventos con hora, título y menú `...`.
   - Botón circular flotante `+`.

### Paso 5: Integración del Estado en `App.tsx` y Layout Responsivo
1. Manejar el estado centralizado:
   - `currentDate`: controla el año y mes en visualización.
   - `selectedDate`: controla el día seleccionado para el detalle.
   - `events`: lista de eventos (inicializada con los mocks).
2. Layout responsivo en `App.module.css`:
   - En pantallas grandes: Disposición en 3 columnas (`Sidebar` | `CalendarGrid` con `Header` | `DayPanel`).
   - En tablets/móviles: Colapso fluido o apilado vertical con menú deslizable para mantener la usabilidad.

### Paso 6: Verificación y Compilación
1. Ejecutar `npm run build` para validar que no haya errores de tipado en TypeScript.
2. Comprobar manualmente la navegación interactiva:
   - Cambiar año en el Sidebar y verificar que los contadores y días se actualicen.
   - Seleccionar distintos meses y validar la cuadrícula de 6 semanas.
   - Hacer clic en celdas de días para ver reflejados sus eventos en el panel de detalle.

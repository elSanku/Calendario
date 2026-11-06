# Plan Técnico — Spec 002: Integración de Feriados Nacionales de Chile

## 1. Resumen de la Solución
Este plan define la integración frontend de los feriados oficiales de Chile en **Antigravity Calendar** a través de la API pública `https://privados.cl/apiholidays/public/CL/{YEAR}`.

La solución permite que el calendario:
1. Consulte y sincronice dinámicamente los feriados oficiales cada vez que cambie el año seleccionado (ej. 2026, 2027) sin recargar la página.
2. Almacene en `localStorage` bajo `holidays-CL-{year}` los datos para evitar solicitudes redundantes y permitir navegación offline instantánea.
3. Proyecte una píldora visual sutil con tooltip en las celdas festivas de la cuadrícula mensual (42 celdas), respetando los puntos de eventos propios del usuario.
4. Muestre un banner conmemorativo destacado en la cabecera del `DayPanel` cuando el usuario seleccione un día festivo.
5. Mantenga cero dependencias externas adicionales (usando `fetch` nativo del navegador, conforme a la disciplina *Ponytail*).

---

## 2. Modelos y Tipos de Dominio (`src/types/holiday.ts` y `src/types/calendar.ts`)

### `src/types/holiday.ts`
Definición estricta de la estructura devuelta por la API y consumida por los componentes:

```typescript
export interface HolidayRecord {
  id: number | string;
  name?: string;
  date: string; // Formato ISO YYYY-MM-DD
  description: string; // Nombre oficial de la festividad
  country?: string;
  legal?: number;
  sigla?: string;
  type?: string;
  active?: number;
}

export interface HolidayApiResponse {
  records?: HolidayRecord[];
}

export interface Holiday {
  id: string | number;
  date: string; // YYYY-MM-DD
  title: string; // Nombre formateado de la festividad (mapeado de description)
  type?: string;
}

export type HolidaysMap = Record<string, Holiday>;
```

### Extensión en `src/types/calendar.ts`
Se extiende la interfaz `DayCell` para incluir la referencia opcional a `holiday`:

```typescript
export interface DayCell {
  date: string;
  dayNumber: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isSelected: boolean;
  events: CalendarEvent[];
  holiday?: Holiday; // RF-4
}
```

---

## 3. Servicio de Feriados y Caché (`src/utils/holidaysApi.ts`)

### Responsabilidades:
- Consultar el endpoint `https://privados.cl/apiholidays/public/CL/{year}` mediante `fetch` nativo.
- Leer y escribir en `localStorage` con la clave `holidays-CL-${year}`.
- Manejar errores de red o servidores caídos de forma silenciosa y resiliente, retornando `[]`.
- Transformar la lista en un mapa de acceso O(1) indexado por fecha `YYYY-MM-DD`.

```typescript
export const getHolidayStorageKey = (year: number) => `holidays-CL-${year}`;

export async function fetchHolidaysForYear(year: number): Promise<Holiday[]> { ... }
export function createHolidaysMap(holidays: Holiday[]): HolidaysMap { ... }
```

---

## 4. Cuadrícula Mensual (`src/components/CalendarGrid/`)

### Comportamiento y Estilos:
- Cada celda en `CalendarGrid` verificará si `cell.holiday` está presente.
- Cuando exista feriado:
  - Se proyectará una píldora/etiqueta sutil (`.holidayBadge`) con icono conmemorativo (estrella/chispa) y el nombre de la festividad truncado con elipsis para no desbordar.
  - Se añadirá un atributo `title={cell.holiday.title}` para proveer un tooltip nativo accesible al posar el cursor o mantener presionado.
  - `aria-label` se enriquecerá para lectores de pantalla: `${cell.dayNumber}, Feriado: ${cell.holiday.title}...`.
- Convivencia con eventos:
  - Los puntos de eventos (`.dotsContainer`) se renderizan en su ubicación inferior sin colisionar con la píldora superior.
- Módulos CSS (`CalendarGrid.module.css`):
  - `.holidayBadge`: fondo `var(--accent-light)`, texto `var(--accent-primary)`, bordes redondeados `var(--radius-sm)`, tipografía compacta 0.68rem.
  - Cuando la celda esté seleccionada (`.selected`): la píldora se ajustará con fondo blanco translúcido (`rgba(255, 255, 255, 0.22)`) y texto blanco para mantener contraste óptimo.

---

## 5. Panel Lateral de Detalle (`src/components/DayPanel/`)

### Comportamiento y Estilos:
- `DayPanelProps` recibirá una nueva prop opcional: `holiday?: Holiday | null`.
- Cuando `holiday` exista para la fecha seleccionada:
  - Se proyecta un banner festivo (`.holidayBanner`) situado inmediatamente debajo del encabezado de fecha y encima de la lista de eventos.
  - El banner contendrá:
    - Icono temático de conmemoración (`Sparkles` o `Calendar`).
    - Etiqueta pequeña en mayúsculas: `FERIADO NACIONAL`.
    - Nombre oficial de la festividad en negrita destacada.
  - La lista de eventos personales continuará visible y plenamente interactiva debajo del banner.
- Módulos CSS (`DayPanel.module.css`):
  - `.holidayBanner`: Tarjeta con suave elevación Soft UI (`--shadow-soft-sm`), borde izquierdo de acento terracota (`--accent-primary`), fondo `var(--bg-subtle)` o gradiente suave neutro.

---

## 6. Orquestación en la Aplicación (`src/App.tsx`)

### Flujo de Estado:
- Nuevo estado: `const [holidays, setHolidays] = useState<Holiday[]>([]);`
- Estado de carga silenciosa o error: `const [isHolidaysLoading, setIsHolidaysLoading] = useState<boolean>(false);`
- Efecto dependiente de `[currentYear]`:
  - Utiliza una variable de cancelación o `AbortController` para evitar condiciones de carrera si el usuario navega velozmente entre años (ej. 2025 -> 2026 -> 2027).
  - Al resolverse la promesa, actualiza `holidays`.
- Mapeo reactivo:
  - `holidaysMap = useMemo(() => createHolidaysMap(holidays), [holidays]);`
  - Inyecta `holidaysMap` a `generateMonthGrid(currentYear, currentMonthIndex, selectedDateStr, events, holidaysMap)`.
  - Extrae `selectedHoliday = holidaysMap[selectedDateStr] || null` y lo pasa a `<DayPanel ... holiday={selectedHoliday} />`.

---

## 7. Estrategia de Pruebas y Verificación

1. **Pruebas unitarias de API y Caché (`src/utils/holidaysApi.test.ts`)**:
   - Comprueba lectura desde `localStorage` sin hacer `fetch`.
   - Comprueba llamada a `fetch` y escritura en `localStorage` ante cache miss.
   - Comprueba fallback pacífico ante `fetch` fallido (retorna arreglo vacío).
   - Comprueba generación correcta del mapa por fechas `createHolidaysMap`.
2. **Pruebas de Componente `CalendarGrid` (`CalendarGrid.test.tsx`)**:
   - Verifica renderizado del badge de feriado y tooltip correspondiente.
   - Verifica coexistencia con dots de eventos.
3. **Pruebas de Componente `DayPanel` (`DayPanel.test.tsx`)**:
   - Verifica que el banner de feriado se renderice cuando se le proporciona `holiday`.
   - Verifica que los eventos del usuario se listen normalmente debajo del banner.
4. **Verificación Global**:
   - `npm run build` sin errores tipográficos ni advertencias de Vite.
   - `npm run test` con el 100% de las suites en verde (51 tests existentes + nuevos tests).

---

## 8. Mapeo a Requisitos Funcionales
| Componente / Módulo | RF Cubiertos | RNF / Casos Límite |
| :--- | :--- | :--- |
| `src/types/holiday.ts` | RF-8 | Tipado estricto |
| `src/utils/holidaysApi.ts` | RF-1, RF-2, RF-3, RF-9 | RNF-1 (Ponytail / fetch nativo), CL-1, CL-2 |
| `src/utils/dateUtils.ts` | RF-4, RF-5 | Soporte en 42 celdas con lunes al inicio |
| `src/components/CalendarGrid/` | RF-4, RF-5 | RNF-2 (A11y), RNF-3 (CSS Modules) |
| `src/components/DayPanel/` | RF-6, RF-7 | RNF-2 (A11y), RNF-3 (Soft UI) |
| `src/App.tsx` | RF-1, RF-8 | CL-1 (Prevención de race conditions) |

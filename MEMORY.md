# MEMORY.md — Memoria Activa del Proyecto
Memoria del proyecto entre sesiones. Máximo ~60-80 líneas: resume o elimina lo que ya no aporte.

> **Fase Activa**: Spec 002 Integración de Feriados Nacionales de Chile CERRADA E IMPLEMENTADA (7/7).
> **Última actualización**: 6 de noviembre de 2026.

## 1. Estado Actual
- **`specs/002-feriados-chile/`**: **CERRADA E IMPLEMENTADA (7/7)**.
  - Integración nativa de feriados oficiales de Chile (`https://privados.cl/apiholidays/public/CL/{YEAR}`).
  - Consulta y sincronización dinámica por año (ej. 2026, 2027) con almacenamiento en `localStorage` (`holidays-CL-{year}`).
  - Proyección en cuadrícula mensual con fondo ámbar cálido suave (`.holidayCell`), píldora sutil y tooltip accesible sin interferir con dots de eventos.
  - Banner festivo en `DayPanel` cuando el día seleccionado es festivo.
  - Cuadrícula milimétricamente alineada (gaps y `minmax(0, 1fr)` sincronizados entre cabecera y celdas).
  - 100% verificado: 66 tests pasando en Vitest y build limpio.
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
- **Pruebas**: 11 suites de prueba con 65 tests unitarios e integrados pasando al 100% con `npm run test`.
- **Linter**: `oxlint` configurado para análisis estático veloz (0 errores).

## 4. Próximos Pasos
- Atender nuevas peticiones o especificaciones del usuario (ej. categorías dinámicas, exportación de eventos, etc.).

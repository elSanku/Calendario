# MEMORY.md — Memoria Activa del Proyecto
Memoria del proyecto entre sesiones. Máximo ~60-80 líneas: resume o elimina lo que ya no aporte.

> **Fase Activa**: Preparación de Infraestructura SDD y Calibración del Sistema CERRADA Y APROBADA.
> **Última actualización**: 5 de noviembre de 2026.

## 1. Estado Actual
- **Base del Calendario**: **CERRADA, APROBADA Y OPERATIVA**.
  - Cuadrícula fija de 42 celdas por mes (6 semanas completas) con lunes como inicio de semana (`src/components/CalendarGrid/`).
  - Navegación anual y mensual vertical con contador de eventos activos en Sidebar (`src/components/Sidebar/`).
  - Panel lateral de día con lista de eventos, creación rápida, edición y borrado (`src/components/DayPanel/`).
  - Modal accesible para creación/edición con validación de horarios (`src/components/EventFormModal/`).
  - Diálogo de confirmación para acciones destructivas (`src/components/ConfirmDialog/`).
- **Infraestructura SDD**: **CONFIGURADA Y CALIBRADA**.
  - Subagentes operativos: `coordinator`, `planner`, `implementer` y `reviewer` adaptados a React + CSS Modules.
  - Skills SDD calibradas: `/sdd-spec`, `/sdd-plan`, `/sdd-tasks`, `/sdd-implement`, `/sdd-validate`, etc.
  - Constitución del proyecto establecida en `docs/constitution.md`.
  - Directorio de especificaciones listo en `specs/`.

## 2. Decisiones Técnicas Clave
- **Localización Global Dayjs**: Configurado en locale `'es'` con inicio de semana en lunes (`weekStart: 1`). Toda operación de fechas usa utilidades centralizadas en `src/utils/dateUtils.ts`.
- **Estilos con CSS Modules**: Cada componente posee su propio archivo `.module.css` garantizando aislamiento total de clases sin interferencia global.
- **Validación Estricta de Eventos**: `src/utils/eventValidation.ts` asegura títulos obligatorios, formato ISO de fechas y restricción estricta de orden temporal (`startTime < endTime`).
- **Disciplina de Marcas de Auditoría**: Delimitación obligatoria `//INI SPEC-XXX` y `//FIN SPEC-XXX`, con preservación estricta de marcas de specs históricas.

## 3. Calidad y Verificación
- **Compilación**: Limpia y sin advertencias con `npm run build` (TypeScript + Vite).
- **Pruebas**: 10 suites de prueba con 51 tests unitarios e integrados pasando al 100% con `npm run test` (Vitest + React Testing Library).
- **Linter**: `oxlint` configurado para análisis estático veloz.

## 4. Próximos Pasos
- Iniciar la primera especificación formal mediante `/sdd-spec NNN-nombre <descripción>` cuando el usuario solicite una nueva funcionalidad (ej. persistencia local, exportación iCal/Google Calendar, o categorías dinámicas).

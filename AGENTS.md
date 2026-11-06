# AGENTS.md — Antigravity Calendar
Aplicación web interactiva de calendario construida con React 19, TypeScript y Vite, con estilos aislados mediante CSS Modules, gestión de fechas en español mediante Dayjs y una suite completa de pruebas unitarias y de integración con Vitest y React Testing Library.

## Stack y estructura
- React 19 + TypeScript + Vite.
- Arquitectura frontend modular:
  - `src/components/`: Componentes funcionales pequeños, aislados en su propia carpeta junto a su módulo CSS (`<Componente>.module.css`) y pruebas (`<Componente>.test.tsx`).
  - `src/types/`: Definiciones de tipos e interfaces del dominio (`CalendarEvent`, categorías, estados).
  - `src/utils/`: Funciones utilitarias puras de fechas (`dateUtils.ts`) y validación de eventos (`eventValidation.ts`).
  - `src/mocks/`: Datos semilla de eventos para inicialización y pruebas.
  - `specs/`: Especificaciones SDD (`spec.md`, `plan.md`, `tasks.md`).
  - `docs/`: Constitución del proyecto (`constitution.md`) y reportes de auditoría.

## Convenciones
- **CSS Modules estricto**: Estilos únicamente mediante `<Componente>.module.css`. Prohibido el uso de clases utilitarias globales no configuradas (ej. Tailwind) o estilos inline para estructura.
- **Manejo de fechas con Dayjs**: Configurado con locale `'es'`. Prohibido mutar objetos Date nativos o manipular fechas mediante strings manuales.
- **Idioma 100% en Español para el usuario**: Todo texto de la interfaz gráfica, botones, alertas, formularios, modales, documentación e informes van íntegramente en español.
- **Identificadores técnicos limpios**: Variables, tipos, interfaces, componentes y funciones en inglés estándar (`CalendarEvent`, `selectedDate`, `handleSubmit`, `isCurrentMonth`).
- **Componentes limpios**: Componentes funcionales, lógica desacoplada en hooks o utilidades, props fuertemente tipadas y sin `any`.
- **Trazabilidad y marcas de auditoría**: Delimitar obligatoriamente todo bloque de código nuevo o editado con marcas formales:
  `//INI SPEC-XXX - NN` y `//FIN SPEC-XXX - NN` (o `/* INI SPEC-XXX - NN */` en CSS).
- **Regla de preservación histórica**: En modificaciones de archivos existentes, NUNCA borrar ni sobreescribir marcas históricas (`//INI SPEC-00X`); preservar el bloque original y delimitar quirúrgicamente solo las líneas modificadas con un comentario explicativo.

## Datos y Dominio
- **`CalendarEvent`**:
  - `id`: Identificador único (string/uuid).
  - `title`: Título del evento (obligatorio, no vacío).
  - `description`: Descripción opcional.
  - `date`: Fecha en formato ISO `YYYY-MM-DD`.
  - `startTime` / `endTime`: Horas en formato `HH:mm` (validando `startTime < endTime`).
  - `color` / `category`: Identificador de categoría o color visual para la celda.

## Lógica de Calendario y Fechas (fácil equivocarse)
- **Inicio de semana en Lunes**: La semana siempre comienza en Lunes (`LUN, MAR, MIÉ, JUE, VIE, SÁB, DOM`). Configurado con `weekStart: 1`.
- **Cuadrícula uniforme de 6 semanas (42 celdas exactas)**: Cada vista mensual proyecta siempre 42 casillas (incluyendo días de relleno del mes anterior y siguiente) para evitar desajustes o saltos bruscos de altura en el layout.
- **Días fuera de mes**: Marcar con estilo atenuado (`isCurrentMonth: false`), pero permitiendo su selección interactiva.
- **Navegación de mes/año**: Al cambiar de año o mes, sincronizar correctamente el Sidebar, la cuadrícula central y el panel lateral del día seleccionado.
- **Acciones destructivas**: Eliminar un evento requiere confirmación obligatoria mediante modal accesible (`ConfirmDialog`) con botones en español.

## Forma de trabajar
- **Disciplina SDD**: Spec (`spec.md`) → Plan (`plan.md`) → Tareas (`tasks.md`) → Implementación atómica → Validación.
- **Ponytail**: Preferir la solución más directa y simple; no añadir dependencias externas sin justificación de peso.
- **Anti-UI Slop**: Jerarquía visual deliberada, contrastes legibles (WCAG AA), navegación por teclado y espaciado consistente.
- Al implementar, ejecutar **UNA sola tarea** a la vez, verificar compilación y tests, y marcarla en `tasks.md`.

## Memoria
- Al iniciar la sesión, leer `MEMORY.md` para conocer la fase activa y decisiones técnicas previas.
- Al terminar cada tarea o spec, actualizarlo: fase activa, decisiones clave tomadas y errores a evitar.
- Mantenerlo conciso (máximo ~60-80 líneas): resumir o depurar lo que ya no aporte valor operativo.

## Comandos
- Desarrollo local: `npm run dev`
- Compilación: `npm run build`
- Pruebas unitarias y de integración: `npm run test`
- Linter: `npm run lint`

## Límites
- ✅ Siempre: usar CSS Modules locales para estilos de componentes.
- ✅ Siempre: validar que `startTime < endTime` al crear o editar eventos.
- ✅ Siempre: solicitar confirmación modal antes de eliminar un evento.
- ✅ Siempre: mantener la cuadrícula mensual en 42 celdas con inicio en Lunes.
- ✅ Siempre: delimitar cambios con marcas formales `//INI SPEC-XXX` y `//FIN SPEC-XXX`.
- ✅ Siempre: preservar bloques de specs anteriores intactos al editar.
- ✅ Siempre: verificar compilación limpia (`npm run build`) y pruebas en verde (`npm run test`).
- ⚠️ Pregunta antes: si se desea incorporar una nueva dependencia externa a `package.json`.
- 🚫 Nunca: usar clases de utilidades arbitrarias (Tailwind) ni estilos inline para layout.
- 🚫 Nunca: mostrar textos, alertas o modales en inglés al usuario.
- 🚫 Nunca: mutar el estado de React directamente sin setters o reducer.
- 🚫 Nunca: alterar el locale de fechas fuera de `'es'`.
- 🚫 Nunca: compartir, registrar o exponer direcciones de correo electrónico personales en AGENTS.md, código ni configuraciones del repositorio.
- 🚫 Nunca: dar por finalizada una tarea si rompe la compilación o algún test existente.

## Verificación
- Compilación limpia con `npm run build` sin errores de TypeScript ni Vite.
- Suite de pruebas con `npm run test` pasando al 100%.
- Casos de prueba mínimos a validar en cada módulo:
  1. Renderizado de cuadrícula de 42 celdas con lunes al inicio.
  2. Creación y edición de eventos con validación de horarios (`startTime < endTime`).
  3. Eliminación de eventos con confirmación previa en modal.
  4. Navegación fluida de meses y años desde Sidebar y Header.

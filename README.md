# Antigravity Calendar 📅

Aplicación web interactiva de calendario construida con **React 19**, **TypeScript** y **Vite**, diseñada bajo la disciplina **Spec-Driven Development (SDD)**, principios **Ponytail** (código conciso y sin sobreingeniería) y estándares de diseño **Anti-UI Slop**.

---

## 🌟 Características Actuales (Cimientos)

- **Cuadrícula Mensual Fija de 42 Celdas (6 Semanas)**: Distribución uniforme sin saltos visuales de altura, con inicio de semana en **Lunes** y contraste atenuado para días de meses adyacentes.
- **Barra Lateral de Navegación (Sidebar)**: Selector de año interactivo y listado vertical de los 12 meses con contador de eventos activos.
- **Panel de Detalle del Día (DayPanel)**: Vista detallada de la agenda para la fecha seleccionada, con creación, edición y menú contextual de opciones.
- **Gestión de Eventos con Validación**: Validación de horarios (`startTime < endTime`), campos requeridos y control modal accesible.
- **Acciones Destructivas Seguras**: Diálogo accesible de confirmación modal (`ConfirmDialog`) antes de eliminar eventos.
- **Estilos Aislados**: Estilizado mediante **CSS Modules (`.module.css`)** con diseño adaptable a dispositivos móviles y escritorio.
- **100% en Español**: Textos, nombres de días, meses, alertas y modales completamente localizados con `dayjs` (`es`).
- **Suite de Pruebas**: Pruebas unitarias y de integración completas ejecutadas con **Vitest** y **React Testing Library**.

---

## 🚀 Hoja de Ruta Planeada (Roadmap SDD)

1. 🎨 **Rediseño Visual Profesional (Anti-UI Slop)**: Superar la estética genérica de plantillas mediante una identidad visual propia, tipografía con carácter, contrastes afinados y micro-interacciones suaves.
2. 🇨🇱 **Feriados Nacionales de Chile**: Integración con API pública para proyectar automáticamente días festivos e irrenunciables en la grilla mensual y en el panel de detalle.
3. 🔐 **Autenticación y Perfil de Usuario**: Registro e inicio de sesión seguro por correo para gestionar agendas independientes por usuario.
4. 👤 **Foto y Avatar de Perfil**: Posibilidad de personalizar el perfil de usuario subiendo una imagen/avatar con previsualización en tiempo real.
5. 🔄 **Sincronización con Google Calendar**: Exportación/importación en formato estándar iCal (`.ics`) y sincronización directa con Google Calendar API.

---

## 🛠️ Stack Tecnológico

- **Frontend**: React 19 + TypeScript + Vite
- **Estilos**: CSS Modules (`.module.css`)
- **Fechas**: Dayjs (locale `'es'`, `weekStart: 1`)
- **Iconografía**: Lucide React
- **Pruebas**: Vitest + React Testing Library + JSDOM
- **Linter**: Oxlint
- **Arquitectura de Agentes**: Spec-Driven Development (SDD) con subagentes (`coordinator`, `planner`, `implementer`, `reviewer`)

---

## 💻 Comandos del Proyecto

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo local
npm run dev

# Compilar para producción (TypeScript + Vite)
npm run build

# Ejecutar suite de pruebas unitarias e integración
npm run test

# Ejecutar linter rápido
npm run lint
```

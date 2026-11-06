# Constitución del Proyecto: Antigravity Calendar

Este documento establece los principios y directivas innegociables para el desarrollo y evolución de **Antigravity Calendar**. Todo agente, subagente o desarrollador debe acatar estas reglas sin excepción.

---

## 1. Principio Spec-First (SDD)
- **Ninguna funcionalidad o refactorización sustancial se programa sin especificación**: Todo cambio nace en `specs/<NNN-nombre>/` mediante el ciclo `spec.md` → `plan.md` → `tasks.md`.
- **La spec manda**: Si un comportamiento no está especificado en la spec aprobada, no se implementa. Si surge una duda o caso no contemplado, se detiene el avance y se consulta al usuario.
- **Trazabilidad de auditoría**: Todo cambio en código debe estar delimitado formalmente con marcas de auditoría:
  ```typescript
  //INI SPEC-XXX - NN
  //descripción del bloque
  { código implementado o modificado }
  //FIN SPEC-XXX - NN
  ```

---

## 2. Idioma y Comunicación
- **100% Español en la Interfaz (UI)**: Encabezados, botones, textos de ayuda, nombres de meses y días, modales, alertas, mensajes de error y formularios deben estar íntegramente en español.
- **Documentación y Chat**: Todo reporte, plan, spec y respuesta al usuario se redacta en español.
- **Nombres Técnicos**: Los identificadores de código (variables, funciones, tipos, nombres de componentes) deben mantener convenciones estándar y limpias en la industria (preferentemente en inglés, e.g. `CalendarEvent`, `handleSubmit`, `selectedDate`).
- **Privacidad Estricta**: Queda estrictamente prohibido registrar o compartir direcciones de correo electrónico personales en `AGENTS.md`, archivos de configuración o documentación pública del repositorio.

---

## 3. Stack Tecnológico y Arquitectura
- **Framework & Build**: React (v19) + Vite + TypeScript.
- **Estilos**: **CSS Modules (`.module.css`)** exclusivamente. No se permiten librerías de utilidades globales no configuradas (ej. Tailwind) ni estilos inline para estructura.
- **Manejo de Fechas**: `dayjs` configurado globalmente con locale en español (`'es'`).
- **Iconografía**: `lucide-react`.
- **Estructura de Carpetas**:
  - `src/components/<NombreComponente>/`: Componentes funcionales pequeños y su módulo CSS (`<NombreComponente>.module.css`).
  - `src/types/`: Interfaces y modelos de dominio compartidos.
  - `src/utils/`: Funciones utilitarias puras (fechas, formateo, cálculos de cuadrícula).
  - `specs/`: Especificaciones SDD activas e históricas.
  - `docs/`: Documentación arquitectónica y lineamientos.

---

## 4. Reglas de Negocio del Calendario
1. **Inicio de Semana en Lunes**: La semana siempre comienza en Lunes (`LUN, MAR, MIÉ, JUE, VIE, SÁB, DOM`).
2. **Cuadrícula Uniforme de 6 Semanas**: La vista mensual siempre proyecta 42 celdas (6 filas x 7 columnas) para evitar saltos o desajustes de layout entre meses.
3. **Sidebar de Navegación**: Navegación por año con controles anterior/siguiente y lista vertical de meses con contador de eventos.
4. **Panel de Día**: Muestra los eventos de la fecha activa con opciones para crear, editar y eliminar eventos.
5. **Confirmación Obligatoria**: Toda acción destructiva (ej. eliminar un evento o serie) debe solicitar confirmación previa mediante un modal/diálogo accesible en español.

---

## 5. Calidad, Simplicidad (Ponytail) y Anti-UI Slop
- **Ponytail**: Preferir la solución más directa y simple que resuelva el problema al 100%. Evitar sobreingeniería, abstracciones prematuras y capas innecesarias.
- **Anti-UI Slop**: Diseño intencional con contrastes reales, jerarquía visual clara, espaciado con propósito y componentes accesibles (navegación por teclado, etiquetas `htmlFor`, atributos ARIA cuando corresponda).
- **Verificación Obligatoria**: Antes de dar por completada una tarea o spec:
  - Compilación limpia sin errores de TypeScript ni Vite (`npm run build`).
  - Suite de pruebas unitarias al día y pasando al 100% (`npm run test`).

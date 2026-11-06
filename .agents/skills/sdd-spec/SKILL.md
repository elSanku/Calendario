---
name: sdd-spec
description: Entrevista al usuario y genera la spec inicial para una funcionalidad en specs/NNN-nombre/spec.md. Usa la metodología SDD.
---

# Skill: Especificación SDD (/sdd-spec)

Usa este procedimiento para entrevistar al usuario y generar la especificación inicial de un requerimiento dentro de `specs/NNN-nombre/spec.md`.

## Contexto de Entrada
- **Uso**: `/sdd-spec NNN-nombre idea inicial`
- Carpeta destino: `specs/<NNN-nombre>/`
- Idea o alcance inicial: El texto provisto como argumento.

---

## Procedimiento Obligatorio

### 1. Preparación y Regla de No-Código
- **PROHIBIDO escribir o modificar código** en ningún momento durante este paso.
- Lee [`docs/constitution.md`](docs/constitution.md), [`MEMORY.md`](MEMORY.md) y consulta la guía de [`.agents/skills/sdd/SKILL.md`](.agents/skills/sdd/SKILL.md).

### 2. Entrevista de Clarificación (Preguntas de UNA en UNA)
1. Analiza la idea inicial e identifica ambigüedades, puntos ciegos, casos de error y aspectos fuera de alcance.
2. Haz preguntas al usuario **de UNA en UNA** (máximo 5 preguntas en total).
3. Espera la respuesta del usuario a cada pregunta antes de formular la siguiente. Si el usuario pide generar la spec directamente con lo proporcionado, procede al paso 3.

### 3. Generación del Archivo `specs/<NNN-nombre>/spec.md`
Con las respuestas consolidadas, genera el archivo `spec.md` en la carpeta indicada con:
- `Estado: borrador`
- **Contexto y objetivo**: Problema de negocio que resuelve.
- **Historias de usuario**: `Como <rol>, quiero <acción> para <beneficio>`.
- **Requisitos funcionales en formato EARS (en español)**:
  - *CUANDO <evento>, EL SISTEMA <respuesta>.*
  - *SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.*
  - *MIENTRAS <estado>, EL SISTEMA <respuesta>.*
  - *EL SISTEMA <comportamiento permanente>.*
- **Requisitos no funcionales, casos límite y fuera de alcance**.
- **Criterios de finalización y dudas abiertas**.

### 4. Regla de Pureza de la Spec
> La spec describe exclusivamente el **QUÉ** y el **POR QUÉ**.
> **Prohibido incluir detalles de implementación**: nada de stack, arquitectura técnica, nombres de clases ni nombres de archivos de código (eso se define en la fase de `plan.md`).

### 5. Cierre del Paso
Una vez generado `spec.md`, actualiza brevemente [`MEMORY.md`](MEMORY.md) indicando la nueva spec en estado borrador y presenta un resumen al usuario para su aprobación.

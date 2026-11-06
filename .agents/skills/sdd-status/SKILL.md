---
name: sdd-status
description: Consulta el estado actual y el siguiente paso en el flujo SDD de una spec (uso - /sdd-status NNN-nombre).
---

# Skill: Consulta de Estado SDD (/sdd-status)

Usa este procedimiento para obtener una radiografía rápida del avance de una spec, saber exactamente en qué fase se encuentra y cuál es la siguiente acción recomendada.

## Contexto de Entrada
- **Uso**: `/sdd-status NNN-nombre`
- Carpeta de la spec: `specs/<NNN-nombre>/`

---

## Procedimiento Obligatorio

### 1. Regla de Solo Lectura
> **PROHIBIDO MODIFICAR NINGÚN ARCHIVO**.
> Este skill es exclusivamente informativo y de diagnóstico.

### 2. Inspección de Archivos
Revisa la existencia y estado de:
- `specs/<NNN-nombre>/spec.md` (Evalúa si está en *borrador*, *aprobada* o *implementada*, y si tiene dudas abiertas).
- `specs/<NNN-nombre>/plan.md` (Verifica si ya fue diseñado).
- `specs/<NNN-nombre>/tasks.md` (Cuenta checkboxes marcados `- [x]` vs pendientes `- [ ]`).
- [`MEMORY.md`](MEMORY.md) (Verifica si está referenciada como la spec activa).

### 3. Respuesta al Usuario (Concisa y Directa)
Responde en un bloque breve con los siguientes 3 puntos:

1. **Fase Actual y Estado de la Spec**:
   - Fase del ciclo de vida (Constitución → Spec → Clarificación → Plan → Tareas → Implementación → Validación).
   - Estado del documento (`borrador`, `aprobada`, `en implementación`, `implementada`).
2. **Progreso de Tareas**:
   - Resumen numérico: `X de Y tareas completadas (Z%)`.
   - Si aplica, cuál fue la última tarea terminada y cuál es la próxima tarea pendiente.
3. **Siguiente Paso Exacto**:
   - La acción concreta a realizar.
   - El comando exacto a invocar (ejemplo: `/sdd-implement NNN-nombre T2` o `/sdd-validate NNN-nombre`).

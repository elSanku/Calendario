---
name: sdd-implement
description: Implementa UNA sola tarea de una spec de Antigravity Calendar respetando el plan y la constitución.
---

# Skill: SDD-Implement

Guía al agente implementador en la ejecución atómica de una tarea.

## Reglas
1. Ejecutar **solo** la tarea asignada en `specs/NNN-nombre/tasks.md`.
2. Seguir las directrices de Ponytail (código conciso, componentes pequeños, sin redundancia).
3. Estilos únicamente mediante **CSS Modules (`.module.css`)**, nunca clases arbitrarias no configuradas.
4. Respetar las marcas de auditoría formales:
   `//INI SPEC-XXX - NN`
   `//FIN SPEC-XXX - NN`
5. Verificar que el código compila limpiamente (`npm run build`) y que las pruebas pasan (`npm run test`).
6. Marcar la tarea en `tasks.md` (`- [x] **Tn...**`) y detenerse.

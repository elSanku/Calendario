---
name: sdd-clarify
description: Audita y revisa una spec de Antigravity Calendar como QA para detectar ambigüedades y casos límite.
---

# Skill: SDD-Clarify

Revisa la especificación funcional y técnica antes de autorizar el plan técnico.

## Puntos de Control
1. **Casos Límite de UI/UX de Calendario**:
   - Validación de fechas, horas de inicio y fin (ej. fin anterior a inicio, eventos de día completo).
   - Manejo de superposición de eventos y límites de visualización en celdas de días.
   - Estados vacíos (días o meses sin eventos) y retroalimentación clara al usuario.
   - Confirmación explícita para acciones destructivas (eliminar eventos).
   - Comportamiento responsive en resoluciones pequeñas (móviles < 380px) y pantallas de escritorio.
2. **Consistencia de Negocio**:
   - Inicio de semana siempre en Lunes.
   - Cuadrícula de 6 semanas por mes.
   - Textos 100% en español.
3. **Accesibilidad (a11y)**:
   - Modales accesibles con foco atrapado, etiquetas asociadas por `id`/`htmlFor`, contraste de color y navegación completa por teclado.

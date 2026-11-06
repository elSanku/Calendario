---
name: sdd-plan
description: Diseña y genera el plan técnico (arquitectura frontend, componentes, tipos y utilidades) en specs/NNN-nombre/plan.md.
---

# Skill: SDD-Plan

Define el diseño técnico detallado de una especificación para Antigravity Calendar:

## Estructura del Plan Técnico
1. **Arquitectura Frontend**:
   - `Componentes UI`: Componentes funcionales modulares en `src/components/<NombreComponente>/`.
   - `Estilos`: Módulos CSS dedicados (`<NombreComponente>.module.css`) sin clases globales no deseadas.
   - `Tipos y Modelos`: Interfaces y tipos estrictos en `src/types/`.
   - `Lógica y Fechas`: Funciones utilitarias puras y helpers en `src/utils/` usando `dayjs` (`es`).
2. **Estrategia de Estado y Datos**:
   - Estado local o elevado según necesidad, evitando mutaciones directas.
3. **Estrategia de Pruebas**:
   - Pruebas unitarias o de integración con Vitest y React Testing Library en `src/components/.../*.test.tsx`.
4. **Fases de Implementación**:
   - Tareas ordenadas cronológicamente con criterio de completitud verificable.

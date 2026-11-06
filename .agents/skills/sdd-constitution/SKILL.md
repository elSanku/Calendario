---
name: sdd-constitution
description: Revisa y mantiene la constitución de Antigravity Calendar (principios innegociables en docs/constitution.md).
---

# Skill: SDD-Constitution

Asegura la coherencia de los principios innegociables del proyecto:
1. **Spec-First**: Todo cambio o funcionalidad nace de una especificación en `specs/`.
2. **100% Español**: Interfaz de usuario, mensajes, botones, modales y documentación en español.
3. **Stack Puro**: React + TypeScript + CSS Modules (`.module.css`), `dayjs` (locale `'es'`), `lucide-react` y Vitest.
4. **Reglas de Negocio del Calendario**: Semana inicia en Lunes, cuadrícula de 6 semanas, confirmación previa a cualquier acción destructiva.
5. **Ponytail**: Código conciso, componentes pequeños y legibles, sin dependencias superfluas.
6. **Anti-UI Slop**: Diseño intencional, tipografía cuidada, accesibilidad y contrastes adecuados.
7. **Auditoría**: Delimitación clara con marcas `//INI SPEC-XXX` y `//FIN SPEC-XXX`.

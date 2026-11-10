# MEMORY.md — Memoria Activa del Proyecto
Memoria del proyecto entre sesiones. Máximo ~60-80 líneas: resume o elimina lo que ya no aporte.

> **Fase Activa**: Spec 005 (Conmutador de Temas: Soft UI Cálido y Midnight Vibe) **CERRADA E IMPLEMENTADA (6/6)**.
> **Última actualización**: 10 de noviembre de 2026.

## 1. Estado Actual
- **`specs/005-conmutador-tema-soft-ui-midnight/`**: **CERRADA E IMPLEMENTADA (6/6)**.
  - Artefactos SDD completos: `spec.md` (Estado: implementada), `plan.md` y `tasks.md` (T1 a T6 completadas).
  - Alcance implementado: Tipos `AppTheme` y persistencia defensiva (`calendar-theme`), tokens CSS globales duales (`[data-theme="light"]` Soft UI Cálido vs `:root, [data-theme="dark"]` Midnight Vibe), subsección accesible "Apariencia" con `role="menuitemradio"` e iconos `Sun`/`Moon` en `UserProfileBadge`, canalización en `Header`, sincronización reactiva en `App.tsx` y cobertura completa de pruebas unitarias e integración.
- **`specs/004-perfiles-header-persistencia-estetica/`**: **CERRADA E IMPLEMENTADA (6/6)**.
  - Tipos `UserProfile`, persistencia autoritaria de eventos en `App.tsx` (sin revivir mocks con F5), componente accesible `UserProfileBadge`, Header anti-colisión y refinamiento estético con gradiente ambiental.
- **`specs/003-modernizacion-frontend-productividad/`**: **CERRADA E IMPLEMENTADA (8/8)**.
  - Chips horizontales con hora tabular, popover flotante `+N más`, filtros en vivo por categoría, Header de productividad y agenda vertical.
- **`specs/002-feriados-chile/`**: **CERRADA E IMPLEMENTADA (7/7)**.
  - Sincronización dinámica de feriados oficiales de Chile (`holidays-CL-{year}`).
- **`specs/001-rediseno-visual-anti-ui-slop/`**: **CERRADA E IMPLEMENTADA (8/8)**.
  - Estética unificada Soft UI / Neumorfismo suave con acento terracota (`#c85a32`).
- **Base del Calendario**: Cuadrícula uniforme de 42 celdas con inicio en Lunes, modales accesibles y confirmación de borrado.

## 2. Decisiones Técnicas Clave
- **Conmutación por Atributo HTML**: Sincronización en `document.documentElement.setAttribute('data-theme', theme)` para permitir selectores CSS limpios (`[data-theme="light"]` vs `:root, [data-theme="dark"]`).
- **Persistencia Segura de Tema**: Clave `calendar-theme` en `localStorage` con fallback defensivo a `'dark'` ("Midnight Vibe") ante valores inválidos o restricciones de almacenamiento.
- **Menú Accesible de Apariencia**: Extensión de `UserProfileBadge` con divisor semántico (`role="separator"`), elementos `role="menuitemradio"`, atributo `aria-checked` e iconos semánticos (`Sun`/`Moon`).
- **Fidelidad Dual**: Restauración del modo "Soft UI Cálido" (lino `#F4F0EA`, tarjeta blanca `#FFFFFF`, acento terracota `#C85A32` y sombras suaves) sin alterar la experiencia inmersiva "Midnight Vibe" (`#0B0E14`, `#06B6D4`, `#8B5CF6`).
- **Disciplina de Marcas**: Delimitación obligatoria `//INI SPEC-005 - NN` y `//FIN SPEC-005 - NN` (o `/* INI SPEC-005 - NN */` en CSS), preservando intactos los comentarios históricos de specs anteriores.

## 3. Calidad y Verificación
- **Compilación**: Limpia y sin advertencias con `npm run build`.
- **Pruebas**: 14 suites con 127 tests pasando al 100% con `npm run test`.
- **Linter**: `oxlint` con 0 errores en 41 archivos.

## 4. Próximos Pasos
- Ejecutar validación global de la Spec 005 (`/sdd-validate 005-conmutador-tema-soft-ui-midnight`) para certificación final de requisitos de usuario.

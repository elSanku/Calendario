# MEMORY.md — Memoria Activa del Proyecto
Memoria del proyecto entre sesiones. Máximo ~60-80 líneas: resume o elimina lo que ya no aporte.

> **Fase Activa**: Spec 004 culminada exitosamente (6/6 tareas). Todas las specs 001, 002, 003 y 004 implementadas y validadas.
> **Última actualización**: 9 de noviembre de 2026.

## 1. Estado Actual
- **`specs/004-perfiles-header-persistencia-estetica/`**: **CERRADA E IMPLEMENTADA (6/6)**.
  - Artefactos SDD completos: `spec.md` (Estado: implementada), `plan.md` y `tasks.md` (T1 a T6 completadas).
  - [x] T1: Tipos `UserProfile` (`src/types/user.ts`) y persistencia autoritaria en `App.tsx` (`loadEvents` sin reinyectar mocks tras borrado).
  - [x] T2: Componente accesible `UserProfileBadge` (avatar de iniciales, nombre, rol activo y menú conmutador Personal/Trabajo).
  - [x] T3: Header anti-colisión: remoción de botón redundante `+ Nuevo [N]`, preservando atajo global `N` en `App.tsx`.
  - [x] T4: Suites de pruebas unitarias (`Header.test.tsx` actualizado y nueva suite `UserProfileBadge.test.tsx`).
  - [x] T5: Atmósfera estética refinada: gradiente ambiental multicapa cálido/piedra y sombras táctiles suaves.
  - [x] T6: Pruebas de integración en `App.test.tsx`, verificación global (`build`, `test`, `lint`) y cierre documental.
- **`specs/003-modernizacion-frontend-productividad/`**: **CERRADA E IMPLEMENTADA (8/8)**.
  - Chips de eventos con hora tabular y título truncado según categoría (`work`, `personal`, `health`, `important`).
  - Popover flotante contextual accesible `+N más` para días con alta densidad de eventos.
  - Filtros en vivo por categoría en `Sidebar.tsx` con switches accesibles (`role="switch"`).
  - Header de productividad con navegación de mes, buscador en vivo y atajos de teclado (`T`, `N`, `←`, `→`).
  - Agenda del día estructurada como línea de tiempo vertical con horas tabulares y descripciones visibles.
- **`specs/002-feriados-chile/`**: **CERRADA E IMPLEMENTADA (7/7)**.
  - Feriados oficiales de Chile sincronizados dinámicamente (`holidays-CL-{year}`).
- **`specs/001-rediseno-visual-anti-ui-slop/`**: **CERRADA E IMPLEMENTADA (8/8)**.
  - Estética unificada Soft UI / Neumorfismo suave con acento terracota (`#c85a32`).
- **Base del Calendario**: Cuadrícula uniforme de 42 celdas con inicio en Lunes, modales accesibles y confirmación de borrado.

## 2. Decisiones Técnicas Clave
- **Persistencia Autoritaria de Eventos**: Si `calendar-events` existe en `localStorage` (incluso `[]`), se respeta como verdad única y nunca se reinyectan `mockEvents` eliminados.
- **Header Anti-Colisión y Despejado**: Retiro del botón `+ Nuevo [N]` para dar respiro al título de mes y buscador; el atajo `N` se preserva intacto en `App.tsx`.
- **Módulo de Perfil Accesible**: `UserProfileBadge` con iniciales vectoriales, roles `Personal` / `Trabajo` y menú accesible (`role="menu"`, teclado `Escape`, `Enter`).
- **Atmósfera Soft UI**: Fondo cálido con gradiente radial tenue multicapa y sombras de elevación orgánica.
- **Disciplina de Marcas**: Delimitación obligatoria `//INI SPEC-004` y `//FIN SPEC-004`, preservando marcas históricas.

## 3. Calidad y Verificación
- **Compilación**: Limpia y sin advertencias con `npm run build` en ~1.0s (TypeScript + Vite).
- **Pruebas**: 14 suites con 121 tests pasando al 100% con `npm run test`.
- **Linter**: `oxlint` con 0 errores en 40 archivos.

## 4. Próximos Pasos
- Validación global o auditoría de cierre de la Spec 004 con `/sdd-validate 004-perfiles-header-persistencia-estetica`.

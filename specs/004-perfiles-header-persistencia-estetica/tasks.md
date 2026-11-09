# Tareas — Spec 004: Perfeccionamiento Visual, Perfiles de Usuario, Header Anti-Colisión y Persistencia Robusta

Checklist de ejecución atómica y secuencial (20-30 min por tarea). Cada tarea debe preservar intactas las marcas históricas (`SPEC-001`, `SPEC-002` y `SPEC-003`), delimitar sus bloques con `//INI SPEC-004 - NN` y `//FIN SPEC-004 - NN` (o `/* INI SPEC-004 - NN */` en CSS) y mantener la compilación (`npm run build`) y las pruebas (`npm run test`) en verde.

- [x] **T1. Tipos de perfil de usuario (`src/types/user.ts`) y corrección autoritaria de persistencia en `src/App.tsx` (`loadEvents`).** RF-1, RF-2, RF-8, RNF-4
  - *Hecho cuando*:
    1. Se cree el archivo `src/types/user.ts` con el tipo `UserProfileRole` (`'Personal' | 'Trabajo'`), la interfaz `UserProfile`, la clave `USER_PROFILE_STORAGE_KEY` y la constante `DEFAULT_USER_PROFILE`.
    2. Se refactorice de forma quirúrgica `loadEvents` en `src/App.tsx` para que, cuando la clave `calendar-events` exista en `localStorage` (incluso como arreglo vacío `[]`), devuelva exclusivamente los eventos guardados y saneados sin reinyectar `mockEvents`.
    3. Se agregue en `App.tsx` el estado reactivo `userProfile` con inicialización perezosa y persistencia automática en `localStorage`.
    4. La suite existente de pruebas continúe pasando sin regresiones (`npm run test`).
  - *Marcas*: `//INI SPEC-004 - 01` y `//FIN SPEC-004 - 01`

- [x] **T2. Componente accesible `UserProfileBadge` con avatar de iniciales y conmutador de contexto en `src/components/UserProfileBadge/`.** RF-5, RF-6, RF-7, RNF-1, RNF-4
  - *Hecho cuando*:
    1. Se cree la carpeta `src/components/UserProfileBadge/` con el componente `UserProfileBadge.tsx` y su módulo de estilos `UserProfileBadge.module.css`.
    2. El componente renderice un botón disparador accesible (`aria-haspopup="menu"`, `aria-expanded`) con avatar de iniciales de alto contraste, nombre del usuario y píldora con el rol activo (**Personal** o **Trabajo**).
    3. Al hacer clic o presionar `Enter`/`Espacio`, se despliegue un menú contextual flotante accesible (`role="menu"`) con las opciones de rol (`role="menuitemradio"`, `aria-checked`), icono de verificación y cierre por selección, tecla `Escape` o clic exterior.
  - *Marcas*: `//INI SPEC-004 - 02` y `//FIN SPEC-004 - 02`

- [x] **T3. Refactorización del `Header`: remoción del botón duplicado `+ Nuevo`, integración de `UserProfileBadge` y layout anti-colisión en `src/components/Header/`.** RF-3, RF-4, RF-5, RNF-2
  - *Hecho cuando*:
    1. Se elimine el botón redundante `newEventBtn` (`+ Nuevo [N]`) del JSX de `Header.tsx` y se retire la prop `onNewEvent` de `HeaderProps`.
    2. Se incorpore `UserProfileBadge` en la sección derecha de `Header.tsx`, recibiendo las props `profile` y `onRoleChange` desde `App.tsx`.
    3. Se ajusten las reglas en `Header.module.css` para prevenir colisiones en resoluciones intermedias (ancho del buscador, truncado seguro de textos, espaciados y flexbox equilibrado).
    4. Se verifique que el atajo global de teclado `N` (o `n`) en `App.tsx` continúe abriendo la ventana modal de creación de eventos.
  - *Marcas*: `//INI SPEC-004 - 03` y `//FIN SPEC-004 - 03`

- [x] **T4. Actualización y ampliación de pruebas unitarias en `Header.test.tsx` y nueva suite `UserProfileBadge.test.tsx`.** RF-3, RF-5, RF-6, RF-7, RNF-1
  - *Hecho cuando*:
    1. Se cree la suite `src/components/UserProfileBadge/UserProfileBadge.test.tsx` validando el renderizado de avatar, nombre, rol inicial, apertura/cierre del menú por clic y tecla `Escape`, y conmutación de rol disparando `onRoleChange`.
    2. Se actualicen las pruebas en `src/components/Header/Header.test.tsx` confirmando la remoción del botón `Nuevo`, la integración de `UserProfileBadge` y el funcionamiento íntegro de la navegación de mes y el buscador.
    3. El 100% de las pruebas unitarias pasen en verde en Vitest.
  - *Marcas*: `//INI SPEC-004 - 04` y `//FIN SPEC-004 - 04`

- [x] **T5. Refinamiento estético y atmosférico en `src/index.css` y `src/App.module.css` (gradiente ambiental, sombras suaves multicapa y diferenciación de superficies).** RF-8, RNF-3
  - *Hecho cuando*:
    1. Se incorpore en `src/index.css` el gradiente ambiental sutil multicapa cálido/piedra sobre el lienzo base (`background-image: radial-gradient(...)`) y se afinen las sombras suaves (`--shadow-soft-md`, `--shadow-soft-lg`) para una percepción táctil pulida (Soft UI).
    2. Se optimice en `src/App.module.css` la delimitación y contraste armónico entre la tarjeta central del calendario (`.calendarCard`), el panel lateral y el área central.
    3. Se compruebe que no se introducen dependencias externas ni degradados artificiales o contrastes deficientes (Anti-UI Slop).
  - *Marcas*: `/* INI SPEC-004 - 05 */` y `/* FIN SPEC-004 - 05 */`

- [x] **T6. Pruebas de integración en `src/App.test.tsx` (persistencia de borrado F5, atajo N, conmutador de perfil), validación general (`build`, `test`, `lint`) y cierre documental.** RF-1 a RF-8, RNF-1 a RNF-5
  - *Hecho cuando*:
    1. Se añada en `src/App.test.tsx` una prueba de integración que verifique que al eliminar un evento inicial de mock, este NO reaparece al simular recarga de página (ejecutando `loadEvents()` sobre el `localStorage` modificado).
    2. Se añada una prueba que confirme la alternancia de contexto en `UserProfileBadge` y su persistencia en `localStorage` bajo `calendar-user-profile`.
    3. Se verifique que el atajo de teclado `N` abre el modal de eventos sin necesidad del botón en cabecera.
    4. `npm run build`, `npm run test` y `npm run lint` finalicen con 0 errores y 100% de tests en verde.
    5. Se actualice `specs/004-perfiles-header-persistencia-estetica/spec.md` y `MEMORY.md` reflejando el avance del proyecto.
  - *Marcas*: `//INI SPEC-004 - 06` y `//FIN SPEC-004 - 06`

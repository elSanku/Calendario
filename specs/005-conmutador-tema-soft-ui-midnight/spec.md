# Spec 005 — Conmutador de Temas: Modo "Soft UI Cálido" y "Midnight Vibe"

Estado: implementada

## Contexto y objetivo
Antigravity Calendar ha alcanzado un alto nivel de madurez visual y funcional a través de sus iteraciones:
- En la **Spec 001**, se introdujo una estética unificada Soft UI / Neumorfismo táctil inspirada en tonos lino, piedra y terracota artesanal (`#c85a32`).
- En las **Specs 003 y 004**, se consolidó el modo envolvente de alta productividad **Midnight Vibe** (obsidiana `#0B0E14`, navy `#121620`/`#181E2B`, turquesa eléctrico `#06B6D4` y violeta digital `#8B5CF6`), ideal para trabajo nocturno o pantallas OLED.

Sin embargo, los usuarios operan en condiciones lumínicas cambiantes y poseen preferencias de confort visual diversas:
1. **Fatiga visual diurna**: En habitaciones con luz natural brillante o exteriores, las interfaces oscuras pueden requerir mayor esfuerzo de lectura por reflejos y contraste relativo.
2. **Preferencia táctil orgánica**: Una porción significativa de usuarios valora profundamente la calidez artesanal, la textura de lino y la elegancia del **Soft UI Cálido**.
3. **Ausencia de conmutación accesible**: Actualmente el tema Midnight Vibe se encuentra fijo en las variables CSS de `:root`, sin un mecanismo interactivo ni semántico para conmutar de tema o persistir la preferencia personal.

El objetivo de la **Spec 005** es implementar un **Conmutador de Temas Integral** que permita alternar instantánea y fluidamente entre el **Modo Claro ("Soft UI Cálido")** y el **Modo Oscuro ("Midnight Vibe")**:
- Totalmente integrado en el módulo de perfil de usuario (`UserProfileBadge`) dentro de una sección accesible denominada **"Apariencia"**.
- Conmutación basada en el atributo estándar `data-theme="light" | "dark"` en el elemento raíz del documento (`document.documentElement`).
- Persistencia automática de la preferencia en `localStorage` bajo la clave `calendar-theme`, manteniendo como valor predeterminado seguro `"dark"` (Midnight Vibe).
- Cero dependencias externas (Principio *Ponytail*), estricta adherencia a *Anti-UI Slop* (contraste real WCAG AA, paletas auténticas) y navegación accesible por teclado y lectores de pantalla.

---

## Usuarios
- **Profesional en entornos cambiantes**: Trabaja con su laptop en oficinas iluminadas o cafeterías durante el día (donde prefiere la luminosidad natural de Soft UI Cálido) y continúa revisando su agenda por la noche en casa (donde activa Midnight Vibe para descansar la vista).
- **Usuario con preferencia de contraste táctil**: Aprecia la estética editorial y la sutileza de tonos lino, terracota y sombras multicapa suaves.
- **Usuario de tecnología asistiva**: Navega el calendario íntegramente por teclado (`Tab`, flechas, `Enter`, `Escape`) o lector de pantalla y requiere que el conmutador de tema anuncie su estado semánticamente (`role="menuitemradio"`, `aria-checked`).

---

## Historias de usuario
- **HU-1 (Conmutación accesible de tema)**: Como usuario del calendario, quiero poder alternar en cualquier momento entre el Modo Claro ("Soft UI Cálido") y el Modo Oscuro ("Midnight Vibe") desde el menú de usuario en la cabecera mediante ratón o teclado, para adaptar la interfaz a mis condiciones de iluminación.
- **HU-2 (Persistencia en localStorage)**: Como usuario recurrente, quiero que mi preferencia de tema se guarde en `localStorage` bajo la clave `calendar-theme` para que al recargar la página (F5) o volver en futuras sesiones, la aplicación conserve inmediatamente el tema que seleccioné.
- **HU-3 (Fidelidad cromática Soft UI Cálido)**: Como usuario diurno, cuando active el Modo Claro quiero disfrutar de una paleta cálida y orgánica (lienzo off-white/lino, tarjetas piedra suave, sombras multicapa difusas, acento terracota `#c85a32` y badges legibles con contraste WCAG AA), sin tonos fríos fluorescentes ni blancos quemados planos.
- **HU-4 (Preservación de Midnight Vibe)**: Como usuario nocturno o de alto contraste, quiero que el Modo Oscuro preserve intacta la atmósfera Midnight Vibe actual (fondo obsidiana `#0B0E14`, acento turquesa eléctrico `#06B6D4`, acento violeta `#8B5CF6`, tarjetas midnight navy y sombras con sutil glow), garantizando que no se degrade el contraste ni la jerarquía existente.

---

## Definiciones
- **`AppTheme`**: Tipo unión `'light' | 'dark'` que define los dos estados formales de apariencia de la aplicación.
- **Atributo `data-theme`**: Atributo HTML aplicado en el nodo raíz `<html>` (`document.documentElement`), utilizado como selector CSS prioritario (`[data-theme="light"]` y `[data-theme="dark"]`) para redefinir las variables de color globales.
- **Soft UI Cálido (`light`)**: Tema visual estructurado con lienzo en tono lino/arena (`#F4F0EA`), tarjetas en blanco puro orgánico (`#FFFFFF`), superficies secundarias piedra suave (`#FBF9F5`), texto carbón (`#262422`) y acento terracota artesanal (`#C85A32`).
- **Midnight Vibe (`dark`)**: Tema visual estructurado con lienzo obsidiana (`#0B0E14`), tarjetas navy noche (`#121620`), superficies secundarias (`#181E2B`), texto slate brillante (`#F1F5F9`) y acentos turquesa eléctrico (`#06B6D4`) y violeta (`#8B5CF6`).
- **Sección Apariencia**: Subsección accesible en el menú desplegable de `UserProfileBadge`, separada por un divisor y compuesta por radio buttons semánticos para conmutar de tema.

---

## Requisitos funcionales (EARS en español)

### Gestión y persistencia del tema
- **RF-1**: EL SISTEMA proveerá dos temas visuales completos e independientes: `"dark"` ("Midnight Vibe", predeterminado) y `"light"` ("Soft UI Cálido").
- **RF-2**: CUANDO la aplicación se inicialice en el navegador, EL SISTEMA leerá la preferencia de tema almacenada en `localStorage` bajo la clave `calendar-theme`. SI la clave no existe o contiene un valor distinto de `"light"` o `"dark"`, ENTONCES EL SISTEMA adoptará `"dark"` como tema por defecto.
- **RF-3**: CUANDO el tema activo cambie o al montarse la aplicación, EL SISTEMA actualizará de forma reactiva el atributo `data-theme` en el elemento raíz del documento (`document.documentElement.setAttribute('data-theme', theme)`) y persistirá de inmediato el valor en `localStorage`.

### Interfaz del conmutador de tema en UserProfileBadge
- **RF-4**: EL SISTEMA extenderá el menú contextual de `UserProfileBadge` incorporando una sección dedicada titulada `"Apariencia"`, posicionada después de la sección de roles de usuario y delimitada visual y semánticamente mediante un divisor (`role="separator"` o elemento de separación accesible).
- **RF-5**: DENTRO de la sección `"Apariencia"`, EL SISTEMA renderizará dos opciones interactivas:
  1. **"Modo Claro"**: Acompañada del icono solar (`Sun` de `lucide-react`) y el subtítulo o etiqueta clara.
  2. **"Modo Oscuro"**: Acompañada del icono lunar (`Moon` de `lucide-react`) y el subtítulo o etiqueta clara.
  Ambas opciones se marcarán como elementos de menú excluyentes mediante `role="menuitemradio"` y reflejarán el estado activo mediante `aria-checked="true"`.
- **RF-6**: CUANDO el usuario seleccione una opción de tema en el menú (mediante clic con el ratón o presionando `Enter`/`Espacio`), EL SISTEMA conmutará el tema activo, actualizará las variables CSS en tiempo real sin recargar la página, cerrará el menú contextual y devolverá el foco al botón disparador del perfil.

### Fidelidad visual y tokens de diseño
- **RF-7**: MIENTRAS el atributo activo sea `[data-theme="light"]`, EL SISTEMA proyectará las variables CSS globales de **Soft UI Cálido**:
  - Lienzo base: `--bg-canvas: #F4F0EA` con gradiente ambiental cálido lino/piedra.
  - Tarjeta elevada: `--bg-surface-elevated: #FFFFFF` y celdas `--bg-surface: #FBF9F5`.
  - Acento interactivo: `--accent-primary: #C85A32` (terracota artesanal) y `--accent-contrast: #FFFFFF`.
  - Textos: `--text-primary: #262422`, `--text-secondary: #6B6560`, `--text-tertiary: #9C948B`.
  - Chips de categorías adaptados a fondos claros con alto contraste (cyan, esmeralda, morado y rosa equilibrados).
- **RF-8**: MIENTRAS el atributo activo sea `[data-theme="dark"]` o `:root`, EL SISTEMA proyectará de forma idéntica e inmutable las variables CSS globales de **Midnight Vibe** existentes (`#0B0E14`, `#181E2B`, `#121620`, `#06B6D4`, `#8B5CF6`).

---

## Requisitos no funcionales
- **RNF-1 (Accesibilidad WCAG AA y Navegación por Teclado)**: Ambas opciones de tema dentro del menú deben soportar navegación estándar por teclado (`Tab`, flechas arriba/abajo, `Enter`, `Espacio`, `Escape`). Los textos y elementos interactivos en ambos temas deben cumplir con la relación de contraste mínima de 4.5:1 exigida por WCAG AA.
- **RNF-2 (Transición visual fluida y sin parpadeo FOUC)**: La sincronización del tema en `document.documentElement` debe ocurrir de manera síncrona en la carga y las transiciones de color en fondos y bordes deben ejecutarse de manera suave (~180ms - 220ms ease), eliminando cualquier salto abrupto o destello blanco/negro no intencional.
- **RNF-3 (Anti-UI Slop y Cohesión Estética)**: El modo claro debe alejarse de plantillas genéricas planas, manteniendo la profundidad táctil de Soft UI con sombras multicapa suaves (`--shadow-soft-md`, `--shadow-soft-lg`) y un gradiente ambiental orgánico; el modo oscuro mantiene intacto su carácter inmersivo Midnight Vibe.
- **RNF-4 (Principio Ponytail y Cero Dependencias Nuevas)**: No se incorporarán librerías de temas externas (como `next-themes` o plugins de CSS). La conmutación se gestiona exclusivamente con React nativo, atributos HTML estándar y CSS Modules con variables globales.
- **RNF-5 (Trazabilidad y Preservación Histórica)**: Todo bloque nuevo o modificado se delimitará estrictamente con `//INI SPEC-005 - NN` y `//FIN SPEC-005 - NN` (o `/* INI SPEC-005 - NN */` en CSS), preservando inalteradas las marcas de `SPEC-001`, `SPEC-002`, `SPEC-003` y `SPEC-004`.

---

## Casos límite
- **CL-1 (Dato corrupto o clave alterada en localStorage)**: Si un usuario o script introduce un valor inválido en `localStorage.getItem('calendar-theme')` (ej. `"cyberpunk"`, `""`, `"null"`), el sistema lo detectará mediante la función validadora y recurrirá con seguridad a `"dark"`.
- **CL-2 (Almacenamiento local restringido o bloqueado)**: Si el navegador bloquea el acceso a `localStorage` (modo incógnito restrictivo o cookies deshabilitadas), la aplicación debe atrapar la excepción silenciosamente, aplicar el tema en memoria de sesión y continuar operando sin romper la interfaz.
- **CL-3 (Conmutación rápida reiterada)**: Si el usuario alterna rápidamente entre ambos temas varias veces consecutivas, el ciclo de render no debe desincronizar el atributo del DOM ni duplicar eventos en el menú.
- **CL-4 (Viewport móvil y pantallas estrechas < 400px)**: El menú de usuario de `UserProfileBadge` con la nueva sección de apariencia debe mantenerse completamente dentro de los márgenes de la pantalla, sin recortar texto ni desbordar horizontalmente.

---

## Fuera de alcance
- Conmutador con modo automático `"system"` (sincronización con `prefers-color-scheme` del SO): Se evaluará en futuras specs; esta spec se enfoca en la conmutación deliberada explícita por el usuario entre los dos estilos consolidados del proyecto.
- Nuevos temas cromáticos adicionales (ej. temas monocromáticos o neón).
- Paletas personalizables por el usuario (color picker dinámico).

---

## Criterios de finalización
1. El archivo de tipos `src/types/theme.ts` define con precisión `AppTheme`, `THEME_STORAGE_KEY`, `DEFAULT_THEME` y utilidades de validación.
2. `src/index.css` cuenta con el conjunto completo de tokens para `[data-theme="light"]` (Soft UI Cálido) y preserva íntegramente `:root, [data-theme="dark"]` (Midnight Vibe).
3. `UserProfileBadge` expone la sección accesible "Apariencia" con botones para "Modo Claro" y "Modo Oscuro", con soporte de iconos `Sun`/`Moon`, marcado ARIA `role="menuitemradio"` y `aria-checked`.
4. El Header propaga fluidamente las props de tema desde `App.tsx` hasta `UserProfileBadge`.
5. `App.tsx` inicializa y persiste el tema en `localStorage`, actualizando el atributo `data-theme` en `document.documentElement`.
6. Las pruebas unitarias de `UserProfileBadge.test.tsx`, `Header.test.tsx` y las pruebas de integración en `App.test.tsx` verifican la conmutación de tema y la persistencia al 100%.
7. La suite completa de pruebas (`npm run test`), compilación (`npm run build`) y linter pasan limpiamente con 0 errores.

# Spec 001 — Rediseño Visual Profesional (Anti-UI Slop)

Estado: implementada

## Contexto y objetivo
La interfaz actual de **Antigravity Calendar** presenta una estética fragmentada y genérica de IA (degradados oscuros saturados, barra lateral lila estridente y botones con colores dispares heredados de dos maquetas diferentes).

El objetivo de esta especificación es unificar la experiencia visual bajo una dirección de diseño **Soft UI moderno / Neumorfismo suave**, con una estética táctil, cálida y profesional que elimine los clichés de IA (Anti-UI Slop). Se busca crear una jerarquía clara, sombras multicapa difuminadas, esquinas redondeadas generosas, paleta con acentos en terracota/ámbar cálido y un comportamiento adaptable en dispositivos móviles que priorice la cuadrícula mensual mediante paneles colapsables.

---

## Usuarios
- **Usuario organizador**: Persona que utiliza el calendario a diario en su computadora o teléfono y necesita una vista mensual clara, agradable a la vista, táctil y libre de fatiga visual.
- **Usuario móvil**: Persona que accede desde un teléfono inteligente y requiere acceder a la cuadrícula de 42 días sin desbordes horizontales ni paneles amontonados.

---

## Historias de usuario
- **HU-1**: Como usuario del calendario, quiero una interfaz visualmente cohesiva y elegante con profundidad táctil suave para organizar mis eventos en un entorno libre de clichés visuales.
- **HU-2**: Como usuario en dispositivo móvil, quiero que el Sidebar y el Panel de Día no estorben la cuadrícula mensual para poder revisar y tocar los días cómodamente en pantallas pequeñas.
- **HU-3**: Como usuario que navega por teclado o con lectores de pantalla, quiero estados de foco visibles y componentes de alto contraste para operar el calendario sin barreras de accesibilidad.

---

## Requisitos funcionales (EARS en español)

### Sistema Visual y Paleta (Soft UI Táctil)
- **RF-1**: EL SISTEMA aplicará una paleta de color armónica basada en fondos neutros cálidos (off-white / piedra suave), superficies elevadas con sombras multicapa difusas y acentos interactivos principales en tono terracota / ámbar cálido.
- **RF-2**: EL SISTEMA dotará a las tarjetas, modales y botones de esquinas redondeadas generosas (radios de entre 12px y 24px) y micro-relieves sutiles que emulen elevación táctil sin perder legibilidad.
- **RF-3**: CUANDO el usuario interactúe con elementos clickeables (celdas de días, botones de acción, meses del Sidebar), EL SISTEMA proporcionará retroalimentación táctil inmediata (cambio de elevación sutil, transición suave de sombra o atenuación de color).

### Jerarquía Tipográfica y Cuadrícula Mensual
- **RF-4**: EL SISTEMA utilizará una pila tipográfica de sistema de alto rendimiento (SF Pro, Segoe UI, Roboto) con jerarquía clara de pesos (500 medio, 600 semibold y 700 bold) y espaciado de texto (letter-spacing) optimizado.
- **RF-5**: EL SISTEMA mantendrá intacta la cuadrícula uniforme de 6 semanas (42 celdas exactas) comenzando obligatoriamente en Lunes, distinguiendo con claridad el día actual (`isToday`), el día seleccionado (`isSelected`) y los días de relleno de meses contiguos (`isCurrentMonth: false`).
- **RF-6**: MIENTRAS una celda de día contenga eventos programados, EL SISTEMA proyectará puntos indicadores (dots) con colores contrastantes y un acabado suave que no sature la celda.

### Adaptabilidad y Experiencia Móvil
- **RF-7**: EN PANTALLAS DE ESCRITORIO (ancho >= 1024px), EL SISTEMA presentará el calendario en una tarjeta central flotante con tres zonas visibles simultáneamente: Sidebar izquierdo, Cuadrícula central y Panel de detalle del día derecho.
- **RF-8**: EN PANTALLAS MÓVILES (ancho < 768px), EL SISTEMA mostrará la cuadrícula como elemento principal de ancho completo y ofrecerá controles de acceso (botones / drawer accesible) para desplegar el Sidebar de navegación de meses y el Panel del Día seleccionado sin comprimir las 42 celdas.

### Modales y Componentes de Diálogo
- **RF-9**: CUANDO se abra el modal de creación/edición de eventos o el diálogo de confirmación de eliminación, EL SISTEMA proyectará un telón de fondo (backdrop) con desenfoque suave (backdrop-filter) y una ventana modal centrada con bordes redondeados y sombra multicapa elevada.
- **RF-10**: EL SISTEMA mantendrá todos los textos, títulos, etiquetas de campo y botones de diálogo 100% en español.

---

## Requisitos no funcionales
- **RNF-1 (Accesibilidad WCAG AA)**: Todo texto debe cumplir una relación de contraste mínima de 4.5:1 contra su fondo directo.
- **RNF-2 (Navegación por Teclado)**: Todo elemento interactivo debe contar con un indicador de foco visible (`focus-visible`) nítido y coherente con el acento terracota.
- **RNF-3 (Cero Dependencias Externas de Estilo)**: Todos los estilos deben implementarse exclusivamente con CSS Modules (`.module.css`), sin frameworks CSS externos ni librerías pesadas de fuentes web.
- **RNF-4 (Rendimiento)**: Las transiciones y micro-interacciones deben ejecutarse a 60 fps mediante transformaciones aceleradas por hardware (`transform`, `opacity`, `box-shadow` suave).

---

## Casos límite
- **CL-1 (Pantallas ultra-pequeñas < 360px)**: Los números de los 42 días y los dots de eventos deben mantenerse legibles y tocables (objetivo táctil mínimo de 36x36px).
- **CL-2 (Días con muchos eventos)**: Si un día tiene más de 3 eventos, el diseño del indicador debe mostrar un contador o agrupación sutil (+N) para evitar desbordes visuales en la casilla.
- **CL-3 (Títulos largos en el DayPanel)**: Los títulos de eventos que superen el ancho del panel deben truncarse elegantemente con puntos suspensivos (`text-overflow: ellipsis`) o permitir quiebre de línea sin desbordar el contenedor.

---

## Fuera de alcance
- Cambios en el modelo de datos de `CalendarEvent` o en la lógica de almacenamiento (se preserva la estructura actual).
- Integración de temas dinámicos oscuro/claro (se define una paleta base cálida Soft UI unificada en esta spec; el selector de temas queda para specs posteriores).
- Autenticación o sincronización externa (pertenecen a las Specs 003 y 005).

---

## Criterios de finalización
1. La totalidad de los componentes (`App`, `Header`, `Sidebar`, `CalendarGrid`, `DayPanel`, `EventFormModal`, `ConfirmDialog`) comparten una paleta unificada Soft UI con sombras suaves y acento terracota/ámbar cálido.
2. No quedan rastros de degradados verdes saturados ni de la barra lila discordante.
3. El layout responde fluidamente en escritorio y dispositivos móviles mediante paneles colapsables/drawer sin romper la grilla de 42 celdas.
4. Compilación limpia sin errores (`npm run build`).
5. La suite de 51 pruebas de Vitest pasa al 100% sin regresiones funcionales.

---

## Dudas abiertas
*Ninguna duda pendiente tras la entrevista de clarificación inicial.*

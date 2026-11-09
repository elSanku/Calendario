# Spec 004 — Perfeccionamiento Visual, Perfiles de Usuario, Header Anti-Colisión y Persistencia Robusta

Estado: implementada

## Contexto y objetivo
Tras la exitosa entrega de la Spec 003 (chips horizontales con hora tabular, filtros reactivos por categoría, popover `+N más`, buscador dinámico y feriados oficiales de Chile), **Antigravity Calendar** cuenta con una base sólida de productividad. Sin embargo, las auditorías de experiencia de usuario y calidad técnica identificaron cuatro oportunidades esenciales de perfeccionamiento:

1. **Persistencia de eliminaciones (bug de resurrección con F5)**: En `src/App.tsx`, la función `loadEvents` combina los datos almacenados en `localStorage` con `mockEvents.filter((m) => !storedIds.has(m.id))`. Cuando un usuario elimina un evento proveniente de los datos semilla y recarga la página (F5), dicho evento vuelve a aparecer porque su identificador ya no está en `storedIds`. Se debe garantizar una persistencia real y fidedigna donde los datos guardados en `localStorage` constituyan la única fuente de verdad autoritaria una vez inicializada la aplicación.
2. **Header despejado y anti-colisión**: En la barra superior, el botón `+ Nuevo [N]` duplica la acción principal del panel de agenda (`+ Nuevo evento`) y satura el ancho horizontal, generando riesgo de colisión o compresión visual contra el selector de mes y el buscador en resoluciones intermedias (laptops compactas y tablets). Es necesario retirar este botón duplicado de la cabecera, preservando de manera intacta el atajo global de teclado `N` (o `n`).
3. **Módulo de perfil de usuario y conmutador de contexto**: La interfaz carece de un indicador humano de contexto. Se incorporará en el extremo derecho de la cabecera un componente accesible de perfil (`UserProfileBadge`) que muestre avatar con iniciales tipográficas, nombre y rol activo (**Personal** o **Trabajo**), desplegando un conmutador de contexto liviano y accesible por teclado y ratón.
4. **Atmósfera estética refinada (anti-diseño plano)**: El fondo y las superficies actuales tienden a una uniformidad plana. Se aplicará un sutil gradiente ambiental multicapa cálido/piedra en el lienzo base, elevación táctil orgánica con sombras multicapa suaves y una clara diferenciación de jerarquía entre la tarjeta del calendario, la barra lateral y la cuadrícula central, todo bajo los principios *Ponytail* (sin librerías pesadas) y *Anti-UI Slop* (diseño deliberado, contraste accesible WCAG AA).

---

## Usuarios
- **Profesional multitarea**: Alterna con frecuencia entre su agenda personal y sus compromisos laborales, requiriendo un indicador visible de su contexto activo y un cambio rápido de rol sin recargar ni reconfigurar la aplicación.
- **Usuario meticuloso de calendario**: Espera que cuando borra una actividad, esta permanezca borrada de forma permanente e inequívoca tras recargar la pestaña del navegador (F5), sin que eventos de demostración reaparezcan inesperadamente.
- **Usuario de pantallas compactas / laptops**: Necesita una barra superior despejada donde el título de la fecha, la navegación de meses y el buscador respiren sin amontonamientos ni solapamientos visuales.

---

## Historias de usuario
- **HU-1 (Persistencia real de borrado con F5)**: Como usuario que organiza su calendario, quiero que al eliminar cualquier evento (incluidos los eventos semilla iniciales) y recargar la página con F5, el evento permanezca eliminado definitivamente y no vuelva a resucitar desde los mocks.
- **HU-2 (Header despejado anti-colisión manteniendo atajo N)**: Como usuario que busca claridad visual, quiero que la barra superior esté despejada y distribuya armónicamente la marca, la navegación del mes, el buscador y el perfil de usuario sin botones redundantes, pudiendo seguir creando eventos al instante mediante la tecla `N` o el botón del panel lateral.
- **HU-3 (Módulo de perfil de usuario y conmutador de contexto Personal/Trabajo)**: Como usuario que gestiona distintos ámbitos de su vida, quiero ver mi identidad activa en la cabecera (avatar de iniciales, nombre y rol) y poder alternar con un clic o teclado entre mis contextos **Personal** y **Trabajo** de forma fluida y persistente.
- **HU-4 (Atmósfera estética refinada no plana)**: Como usuario que aprecia los detalles de diseño, quiero experimentar una interfaz con profundidad táctil sutil, donde el fondo posea una calidez orgánica y las tarjetas tengan elevación natural perceptible, sin sombras artificiales pesadas ni bordes toscos.

---

## Definiciones
- **Fuente de verdad autoritaria**: Principio arquitectónico según el cual, una vez que existe la clave `calendar-events` en `localStorage`, su contenido (incluso una lista vacía `[]`) es el único conjunto de eventos válido, anulando la inyección de datos semilla.
- **Header anti-colisión**: Esquema de distribución horizontal en `flex` que reserva márgenes mínimos y prioridades de encogimiento/truncado para que ningún elemento se solape ni desborde en anchos desde 960px hacia arriba.
- **UserProfileBadge**: Componente interactivo que integra un avatar con iniciales tipográficas vectoriales, el nombre del usuario y una píldora indicadora del rol activo (**Personal** o **Trabajo**), con un menú contextual flotante accesible.
- **Gradiente ambiental cálido/piedra**: Fondo del lienzo estructurado con gradientes radiales tenues en tonos lino y piedra que eliminan la sensación plana monocromática sin distraer la atención del contenido principal.

---

## Requisitos funcionales (EARS en español)

### Persistencia Robusta de Eventos
- **RF-1**: CUANDO la clave `calendar-events` esté presente en `localStorage` (incluso si contiene una lista vacía `[]`), EL SISTEMA cargará exclusivamente los eventos almacenados tras sanearlos, sin combinar ni reinyectar los eventos de `mockEvents`, garantizando que cualquier evento eliminado persista eliminado tras recargar la página (F5).
- **RF-2**: SI la clave `calendar-events` no existe en `localStorage` o su contenido se encuentra corrupto, ENTONCES EL SISTEMA inicializará la lista de eventos a partir de `mockEvents` y la almacenará de inmediato en `localStorage` como línea base.

### Header Despejado y Anti-Colisión
- **RF-3**: EL SISTEMA removerá el botón `+ Nuevo [N]` del componente `Header`, redistribuyendo el espacio horizontal en tres secciones equilibradas con espaciado anti-colisión:
  1. *Sección Izquierda*: Logotipo, nombre de la aplicación y fecha activa (mes y año).
  2. *Sección Central*: Controles de navegación de mes (`Mes anterior`, `Hoy`, `Mes siguiente`).
  3. *Sección Derecha*: Campo de búsqueda en vivo y módulo de perfil de usuario (`UserProfileBadge`).
- **RF-4**: MIENTRAS ningún modal o menú interactivo esté abierto y el foco no esté ubicado dentro de un elemento editable (`input`, `textarea`, `select`), EL SISTEMA mantendrá operativo el atajo global de teclado `N` (o `n`) para abrir la ventana modal de creación de eventos (`EventFormModal`) con la fecha seleccionada.

### Módulo de Perfil de Usuario y Conmutador de Contexto
- **RF-5**: EL SISTEMA renderizará en el extremo derecho del `Header` el componente `UserProfileBadge`, mostrando un avatar con iniciales tipográficas de alto contraste, el nombre del usuario y una etiqueta píldora con el rol o contexto activo (**Personal** o **Trabajo**).
- **RF-6**: CUANDO el usuario active el componente `UserProfileBadge` mediante clic o teclado (`Enter` o `Espacio`), EL SISTEMA desplegará un menú contextual flotante accesible (`role="menu"`) con las opciones de contexto disponibles (**Personal** y **Trabajo**), indicando visual y semánticamente (`aria-checked="true"`) el rol seleccionado actualmente.
- **RF-7**: CUANDO el menú contextual de perfil se encuentre desplegado:
  - SI el usuario presiona la tecla `Escape` o hace clic fuera del menú, ENTONCES EL SISTEMA cerrará el menú y devolverá el foco al disparador.
  - SI el usuario selecciona un rol diferente, ENTONCES EL SISTEMA actualizará el perfil activo, cerrará el menú y persistirá la preferencia en `localStorage` bajo la clave `calendar-user-profile`.
- **RF-8**: SI la clave `calendar-user-profile` no existe en `localStorage`, ENTONCES EL SISTEMA inicializará el perfil con el valor por defecto: nombre `"Usuario Demo"`, iniciales `"UD"`, rol activo `"Personal"` y roles disponibles `["Personal", "Trabajo"]`.

---

## Requisitos no funcionales
- **RNF-1 (Accesibilidad y Navegación por Teclado WCAG AA)**: El componente `UserProfileBadge` y su menú contextual deben cumplir con atributos ARIA formales (`aria-haspopup="menu"`, `aria-expanded`, `role="menu"`, `role="menuitemradio"`), relación de contraste mínima de 4.5:1 para el texto e iniciales, y contornos de foco visibles (`:focus-visible`).
- **RNF-2 (Diseño Anti-Colisión y Responsividad)**: La cabecera debe adaptarse dinámicamente a anchos de ventana entre 960px y 1440px sin saltos de línea ni solapamiento entre la fecha, la botonera central, el buscador y el perfil. En dispositivos móviles (<960px), el badge de perfil debe simplificarse mostrando de forma compacta el avatar con iniciales sin desbordar el contenedor.
- **RNF-3 (Atmósfera Estética Soft UI y Principio Anti-UI Slop)**: El fondo del lienzo base (`--bg-canvas`) debe incorporar un gradiente ambiental sutil multicapa de tonos cálidos piedra/lino que elimine la frialdad plana. Las sombras de elevación (`--shadow-soft-md`, `--shadow-soft-lg`) deben poseer múltiples capas de difusión translúcida para proyectar un acabado táctil orgánico, sin brillos estridentes ni degradados fluorescentes.
- **RNF-4 (Simplicidad y Cero Dependencias Nuevas - Principio Ponytail)**: No se incorporarán librerías de estado externas ni componentes de UI de terceros; la conmutación de contexto, el menú accesible y la persistencia se resolverán exclusivamente con hooks nativos de React (`useState`, `useEffect`) y CSS Modules.
- **RNF-5 (Preservación de Trazabilidad Histórica)**: Todo código modificado o incorporado delimitará sus bloques mediante `//INI SPEC-004 - NN` y `//FIN SPEC-004 - NN` (o `/* INI SPEC-004 - NN */` en CSS), respetando intactos los comentarios históricos de las especificaciones `SPEC-001`, `SPEC-002` y `SPEC-003`.

---

## Casos límite
- **CL-1 (Eliminación total de eventos)**: Si el usuario borra todos los eventos de la agenda (dejando un arreglo vacío `[]`), al pulsar F5 el calendario debe mostrar una cuadrícula limpia sin eventos y el panel de día con el estado libre orientador, sin repoblar los mocks originales.
- **CL-2 (Resolución de pantalla ajustada a 960px)**: En el límite exacto del breakpoint desktop (960px), el buscador y el badge de perfil deben ajustar sus anchos o truncar el nombre de usuario de forma elegante con puntos suspensivos (`text-overflow: ellipsis`), sin provocar barras de desplazamiento horizontal en el Header.
- **CL-3 (Atajos de teclado con menú de perfil abierto)**: Si el menú desplegable del perfil está abierto y el usuario presiona la tecla `N` o `T`, el menú debe interceptar o priorizar la navegación del menú y no disparar la creación de eventos hasta que el menú se cierre.
- **CL-4 (Almacenamiento local no disponible o bloqueado)**: Si el navegador bloquea `localStorage` (modo incógnito estricto o cuota excedida), la aplicación debe continuar funcionando en memoria de sesión sin lanzar excepciones no controladas.

---

## Fuera de alcance
- Conexión con sistemas de autenticación remota o proveedores OAuth externos (Google, Microsoft, etc.).
- Carga de archivos de imagen para el avatar (se emplean iniciales tipográficas vectoriales).
- Filtrado segregado de eventos por perfil en esta fase (el conmutador de contexto establece el rol activo del usuario y prepara el terreno para la futura vinculación de calendarios múltiples).

---

## Criterios de finalización
1. La eliminación de eventos semilla y personalizados persiste de manera infalible tras recargar la página (F5) y reiniciar el navegador.
2. El botón redundante `+ Nuevo [N]` queda removido del `Header` y la distribución visual entre marca, mes activo, controles centrales, buscador y perfil se mantiene libre de colisiones.
3. El atajo global de teclado `N` (o `n`) continúa abriendo el modal de creación de eventos cuando el foco está libre.
4. El módulo `UserProfileBadge` se encuentra integrado en la cabecera, muestra iniciales y rol activo, y permite alternar entre **Personal** y **Trabajo** mediante menú accesible por ratón y teclado.
5. El perfil de usuario activo se guarda y recupera automáticamente desde `localStorage`.
6. El lienzo base y la tarjeta del calendario proyectan una atmósfera cálida refinada mediante gradientes ambientales y sombras suaves multicapa.
7. Las pruebas unitarias de `Header.test.tsx`, la nueva suite de `UserProfileBadge.test.tsx` y las pruebas de integración en `App.test.tsx` pasan al 100% en verde.
8. La compilación de producción (`npm run build`) y el linter finalizan con cero errores.

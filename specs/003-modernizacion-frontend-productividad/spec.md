# Spec 003 — Modernización del Frontend y Productividad Reactiva (Fase A)

Estado: implementada

## Contexto y objetivo
Actualmente, **Antigravity Calendar** proyecta sus compromisos en la cuadrícula mensual mediante puntos de color mudos ("puntitos") que obligan al usuario a seleccionar día por día para descubrir qué actividades tiene agendadas. Además, carece de clasificación formal por categorías, filtrado interactivo, búsqueda rápida y controles de productividad en la cabecera o por teclado.

El objetivo de esta especificación es evolucionar la experiencia hacia una **interfaz de productividad reactiva y escaneable de un vistazo** (inspirada en referentes como Notion Calendar, Cron, Amie y Linear), manteniendo una convivencia armónica con los feriados oficiales de Chile (Spec 002) y aplicando un diseño intencional libre de clichés genéricos de IA:
1. Reemplazar los indicadores mudos en las celdas por **chips horizontales de eventos reales** con hora de inicio tabular y título truncado según su categoría.
2. Controlar la densidad visual mostrando hasta 2 eventos por celda y un botón interactivo **`+N más`** que despliegue un **popover flotante contextual** con la agenda completa del día.
3. Incorporar **4 categorías oficiales en español** (**Trabajo**, **Personal**, **Salud**, **Importante**) con filtrado reactivo en tiempo real desde el panel lateral.
4. Transformar la barra superior en un **Header de productividad** con título del mes/año activo, navegación rápida (`Mes anterior`, `Hoy`, `Mes siguiente`), **buscador en vivo** y **atajos globales de teclado** (`T`, `N`, `←`, `→`).
5. Rediseñar la agenda del panel derecho como una **línea de tiempo estructurada** con tipografía numérica tabular, etiqueta de categoría, descripción visible y estados vacíos orientadores.

---

## Usuarios
- **Profesional / usuario intensivo de agenda**: Necesita escanear su semana y mes en segundos sin hacer clic celda por celda, filtrar áreas de su vida (ej. ver solo *Trabajo* o *Salud*) y moverse por el calendario usando atajos de teclado o búsqueda instantánea.
- **Usuario general en Chile**: Requiere distinguir claramente entre un feriado nacional oficial y sus compromisos personales o laborales tanto en la cuadrícula mensual como en la línea de tiempo del día.

---

## Historias de usuario
- **HU-1 (Lectura rápida en celdas)**: Como usuario del calendario, quiero ver la hora de inicio y el nombre de mis eventos directamente dentro de cada casilla del mes como píldoras coloreadas por categoría, para entender mi carga semanal de un vistazo sin tener que hacer clic en cada día.
- **HU-2 (Exploración rápida de días saturados con popover `+N más`)**: Como usuario con múltiples actividades diarias, quiero que cuando un día tenga más de 2 eventos aparezca un botón interactivo `+N más` que abra un popover flotante con todos los eventos de ese día y me permita editarlos o seleccionarlos al instante.
- **HU-3 (Clasificación y filtrado por categorías en vivo)**: Como usuario organizado, quiero asignar una categoría (**Trabajo**, **Personal**, **Salud**, **Importante**) a mis eventos y poder encender o apagar categorías desde el panel lateral para enfocarme solo en un ámbito específico de mi agenda.
- **HU-4 (Navegación de productividad, búsqueda en vivo y atajos de teclado)**: Como usuario productivo, quiero buscar eventos por texto en tiempo real desde la cabecera, saltar al día de hoy o cambiar de mes con un clic o mediante atajos de teclado (`T`, `N`, `←`, `→`) para gestionar mi agenda con fluidez.
- **HU-5 (Agenda del día con línea de tiempo estructurada)**: Como usuario que revisa el detalle de una jornada, quiero visualizar mis compromisos en una línea de tiempo vertical con bloques horarios tabulares, su etiqueta de categoría en español y su descripción completa para preparar mi día con claridad.

---

## Definiciones
- **Chip de evento**: Píldora horizontal compacta dentro de una celda de la cuadrícula que muestra la hora de inicio (cuando existe) y el título del evento truncado en una línea, coloreada según la categoría del evento.
- **Categorías oficiales**: Clasificación cerrada de 4 ámbitos con identidad cromática propia y accesible: **Trabajo**, **Personal**, **Salud** e **Importante**.
- **Popover `+N más`**: Panel flotante contextual anclado o superpuesto que lista la totalidad de los eventos de una celda cuando esta supera el límite de 2 chips visibles.
- **Foco en entrada de texto**: Estado en el que el cursor del usuario se encuentra activo dentro de un campo de texto, área de texto o selector editable, o bien cuando hay una ventana modal abierta.

---

## Requisitos funcionales (EARS en español)

### Chips de Eventos Reales en Celdas (42 casillas)
- **RF-1**: EL SISTEMA reemplazará los puntos indicadores mudos de la cuadrícula mensual por chips horizontales legibles dentro de cada una de las 42 celdas, mostrando la hora de inicio (si el evento tiene horario definido) en formato tabular seguida del título del evento truncado en una sola línea y estilizado con el color semántico de su categoría.
- **RF-2**: MIENTRAS una celda corresponda a un feriado nacional de Chile y además posea eventos del usuario, EL SISTEMA mantendrá la píldora ámbar del feriado en la cabecera de la celda y renderizará los chips de eventos inmediatamente debajo, sin desbordar ni alterar la altura uniforme de las 6 filas de la cuadrícula.

### Control de Densidad y Popover Flotante `+N más`
- **RF-3**: CUANDO una celda del calendario contenga más de 2 eventos visibles (según los filtros activos), EL SISTEMA mostrará únicamente los primeros 2 chips ordenados cronológicamente y renderizará debajo un botón interactivo con el texto `+N más` (donde `N` es la cantidad de eventos restantes en ese día).
- **RF-4**: CUANDO el usuario active el botón `+N más` mediante clic o teclado (`Enter` / `Espacio`), EL SISTEMA desplegará un popover flotante contextual con el encabezado de la fecha y la lista completa de eventos de ese día (incluyendo hora, título, categoría y acceso directo para editar cada evento), el cual se cerrará al presionar la tecla `Escape`, al hacer clic en su botón de cierre o al hacer clic fuera del popover.

### Categorías Oficiales y Filtros Interactivos en Vivo
- **RF-5**: EL SISTEMA dispondrá de 4 categorías oficiales en español: **Trabajo**, **Personal**, **Salud** e **Importante**, permitiendo al usuario seleccionar la categoría deseada dentro del formulario modal al crear o editar un evento (con **Trabajo** como categoría predeterminada para eventos nuevos).
- **RF-6**: EL SISTEMA presentará en el panel lateral izquierdo una sección denominada **Categorías** con interruptores interactivos para activar o desactivar individualmente **Trabajo**, **Personal**, **Salud** e **Importante**, mostrando todas las categorías activas por defecto al iniciar la aplicación.
- **RF-7**: MIENTRAS una o más categorías estén desactivadas en el panel lateral, EL SISTEMA filtrará en tiempo real los eventos proyectados en las 42 celdas de la cuadrícula, los contadores numéricos de eventos de los 12 meses en la barra lateral y la lista de eventos del panel del día seleccionado, manteniendo intactos los feriados nacionales.

### Header de Productividad, Buscador en Vivo y Atajos de Teclado
- **RF-8**: EL SISTEMA presentará en la cabecera superior el título destacado del mes y año actualmente en vista en español (ej. `Noviembre 2026`), acompañado de controles de navegación directa: botón `Mes anterior` (`←`), botón `Hoy` y botón `Mes siguiente` (`→`), sincronizados con el panel lateral y la cuadrícula.
- **RF-9**: CUANDO el usuario escriba un término en el campo de búsqueda en vivo de la cabecera, EL SISTEMA filtrará instantáneamente los eventos mostrados en la cuadrícula mensual, en los contadores mensuales del panel lateral y en el panel del día seleccionado, conservando aquellos cuyo título o descripción contengan el texto buscado (sin distinguir mayúsculas, minúsculas ni tildes), y permitiendo limpiar la búsqueda con un clic o con `Escape`.
- **RF-10**: MIENTRAS ningún modal o popover esté abierto y el foco del navegador no se encuentre dentro de un campo de entrada de texto, EL SISTEMA responderá a los siguientes atajos globales de teclado:
  - Tecla `T` (o `t`): navega inmediatamente al mes y año actual y selecciona la fecha de hoy.
  - Tecla `N` (o `n`): abre el modal de creación de nuevo evento preseleccionando la fecha activa.
  - Tecla `Flecha Izquierda` (`←`): retrocede al mes anterior (ajustando el año si pasa de enero a diciembre).
  - Tecla `Flecha Derecha` (`→`): avanza al mes siguiente (ajustando el año si pasa de diciembre a enero).

### Agenda del Día con Línea de Tiempo y Categorías
- **RF-11**: EL SISTEMA presentará los eventos del día seleccionado en el panel lateral derecho bajo una estructura de línea de tiempo vertical, mostrando para cada evento: su bloque horario en tipografía tabular (o `Todo el día`), una etiqueta tipo píldora con el nombre de su categoría en español, el título del evento, su descripción completa cuando exista y el menú de acciones para editar o eliminar.
- **RF-12**: SI el día seleccionado no posee eventos que coincidan con los filtros o la búsqueda activa, ENTONCES EL SISTEMA mostrará en el panel del día un estado vacío orientador en español que explique la situación e invite explícitamente al usuario a programar un evento o restablecer los filtros activos.

---

## Requisitos no funcionales
- **RNF-1 (Tipografía y Alineación Tabular)**: Todas las horas de eventos (`HH:mm`), contadores mensuales, números de día y badges `+N más` deben aplicar `font-variant-numeric: tabular-nums` para garantizar alineación vertical escaneable.
- **RNF-2 (Contraste y Accesibilidad WCAG AA)**: Los 4 esquemas de color de categoría (**Trabajo**, **Personal**, **Salud**, **Importante**) y el indicador de feriado deben mantener una relación de contraste mínima de **4.5:1** entre el texto de la píldora y su fondo, tanto en celdas normales como cuando la celda está seleccionada.
- **RNF-3 (Estructura como Información — Frontend Design)**: Queda prohibido el uso de sombras decorativas pesadas, degradados artificiales o etiquetas en mayúsculas innecesarias; cada borde izquierdo, color de chip y separador de línea de tiempo debe codificar la categoría o secuencia horaria real del evento.
- **RNF-4 (Retrocompatibilidad de Datos)**: Los eventos existentes en el almacenamiento local o en los datos semilla que carezcan del atributo de categoría deberán inferir o recibir automáticamente una categoría válida a partir de su color o contexto, sin perder datos ni requerir intervención manual del usuario.
- **RNF-5 (Preservación Histórica y Cero Dependencias Nuevas)**: La implementación no añadirá librerías externas al proyecto y preservará íntegramente las marcas de auditoría históricas de las especificaciones anteriores.

---

## Casos límite
- **CL-1 (Día feriado con más de 2 eventos)**: En una celda que sea feriado nacional y además tenga 3 o más eventos, la celda debe mantener su altura fija mostrando la píldora del feriado en la parte superior, 1 o 2 chips de eventos según el espacio estructurado y el botón `+N más` sin romper la grilla de 6 filas.
- **CL-2 (Búsqueda combinada con filtro de categorías)**: Si el usuario busca un texto (ej. `"Reunión"`) y a la vez tiene activada solo la categoría **Trabajo**, únicamente se mostrarán los eventos que cumplan ambas condiciones simultáneamente (intersección lógica `AND`).
- **CL-3 (Desactivación de todas las categorías)**: Si el usuario desmarca las 4 categorías en el panel lateral, la cuadrícula mostrará 0 eventos y el panel del día presentará un mensaje orientador con un botón directo para volver a activar todas las categorías.
- **CL-4 (Atajos de teclado mientras se escribe en el buscador)**: Si el usuario escribe las letras `"t"` o `"n"` o usa las flechas `←` / `→` dentro del campo de búsqueda de la cabecera o dentro del formulario de eventos, los atajos globales NO deben dispararse.
- **CL-5 (Cambio de año al navegar mes a mes)**: Al presionar `Mes anterior` en enero o `Mes siguiente` en diciembre (con clic o flechas de teclado), el año activo debe decrementarse o incrementarse automáticamente, disparando la sincronización de feriados del nuevo año.

---

## Fuera de alcance
- Creación de categorías personalizadas adicionales por parte del usuario (en esta Fase A el conjunto es fijo de 4 categorías oficiales).
- Arrastrar y soltar (drag & drop) de eventos entre celdas.
- Vistas semanales o diarias a pantalla completa en el área central (la vista central se mantiene en cuadrícula mensual de 42 celdas).

---

## Criterios de finalización
1. Las 42 celdas del calendario renderizan chips horizontales con hora y título coloreados por categoría en lugar de puntos mudos, manteniendo altura fija.
2. Las celdas con más de 2 eventos muestran el botón `+N más`, el cual despliega un popover accesible con todos los eventos del día y se cierra con `Escape` o clic fuera.
3. El modal de creación/edición permite elegir entre las 4 categorías oficiales (**Trabajo**, **Personal**, **Salud**, **Importante**) y persiste la elección.
4. El Sidebar permite filtrar en vivo por las 4 categorías, actualizando cuadrícula, contadores mensuales y agenda del día.
5. El Header muestra el mes/año activo, botones `Mes anterior`, `Hoy`, `Mes siguiente` y buscador en vivo por título/descripción.
6. Los atajos de teclado `T`, `N`, `←` y `→` funcionan cuando no hay foco en inputs ni modales abiertos.
7. El panel del día muestra los eventos como línea de tiempo con hora tabular, etiqueta de categoría en español y descripción visible.
8. El 100% de las pruebas unitarias e integradas pasan en verde y la compilación de producción finaliza sin errores.

---

## Dudas abiertas
*Ninguna duda pendiente.*

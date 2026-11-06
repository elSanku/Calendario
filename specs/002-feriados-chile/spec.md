# Spec 002 — Integración de Feriados Nacionales de Chile

Estado: implementada

## Contexto y objetivo
Actualmente, **Antigravity Calendar** permite gestionar eventos de usuario pero carece de contexto de calendario nacional. Los usuarios en Chile necesitan conocer los días feriados oficiales (Año Nuevo, Fiestas Patrias, Navidad, festividades religiosas y civiles) para organizar sus compromisos laborales y personales con antelación.

El objetivo de esta especificación es integrar de forma nativa la API pública de feriados de Chile (`https://privados.cl/apiholidays/public/CL/{YEAR}`) para que, al navegar por cualquier año (por ejemplo, 2026, 2027), el sistema consulte, cachee y proyecte automáticamente los feriados oficiales en la cuadrícula mensual y en el panel de detalle del día, conviviendo de forma limpia y no destructiva con la agenda del usuario.

---

## Usuarios
- **Usuario particular / profesional en Chile**: Necesita planificar actividades y reuniones conociendo con exactitud qué días son feriados en el año actual o venidero.
- **Usuario móvil**: Desea identificar rápidamente un festivo nacional en la cuadrícula de 42 celdas sin que sature la pantalla de su teléfono.

---

## Historias de usuario
- **HU-1**: Como usuario del calendario, quiero que al cambiar de año (ej. a 2027) los feriados se actualicen automáticamente al año seleccionado para planificar compromisos a mediano y largo plazo.
- **HU-2**: Como usuario del calendario, quiero que las celdas de la cuadrícula mensual muestren un indicador sutil cuando un día sea festivo para reconocerlo a simple vista sin tapar mis eventos.
- **HU-3**: Como usuario del calendario, quiero que al seleccionar un día feriado el panel de detalle me muestre un banner superior con el nombre de la festividad, manteniendo intactos y accesibles mis propios eventos del día.
- **HU-4**: Como usuario en zonas con conexión inestable o sin internet, quiero que los feriados ya consultados sigan disponibles sin ralentizar el calendario.

---

## Requisitos funcionales (EARS en español)

### Consulta y Sincronización Dinámica por Año
- **RF-1**: CUANDO el usuario seleccione o navegue a un año determinado (ej. 2026, 2027), EL SISTEMA consultará los feriados oficiales chilenos correspondientes mediante la API `https://privados.cl/apiholidays/public/CL/{YEAR}`.
- **RF-2**: EL SISTEMA almacenará en caché local (`localStorage`) la lista de feriados de cada año consultado bajo la clave `holidays-CL-{year}`, de modo que consultas subsecuentes o recargas del mismo año se resuelvan de forma inmediata (0 ms) sin generar tráfico de red redundante.
- **RF-3**: SI la consulta a la API falla por corte de red o indisponibilidad del servidor externo, ENTONCES EL SISTEMA continuará operando normalmente (fallback resiliente), preservando los eventos del usuario y los feriados previamente cacheados sin lanzar errores bloqueantes.

### Visualización en la Cuadrícula Mensual (42 celdas)
- **RF-4**: MIENTRAS una celda de la cuadrícula coincida con la fecha de un feriado nacional, EL SISTEMA proyectará un fondo distintivo en ámbar cálido suave (`.holidayCell`) y un badge o píldora visual con un tooltip o etiqueta accesible que detalle el nombre de la festividad.
- **RF-5**: EL SISTEMA asegurará que el badge de feriado coexista limpiamente con los puntos de color (dots) de los eventos propios del usuario, sin ocultarlos ni desplazarlos fuera de la celda.

### Visualización en el Panel de Detalle del Día (DayPanel)
- **RF-6**: CUANDO el usuario seleccione una fecha que coincida con un feriado nacional, EL SISTEMA proyectará en la parte superior del DayPanel un banner festivo destacado con un icono conmemorativo y el nombre oficial de la festividad.
- **RF-7**: EL SISTEMA mantendrá la lista de eventos propios del usuario directamente debajo del banner festivo, permitiendo agregar, editar y eliminar eventos normalmente en días feriados.

### Integridad de Datos e Idioma
- **RF-8**: EL SISTEMA tratará los feriados exclusivamente como información de solo lectura; en ningún caso los feriados mutarán, reemplazarán ni borrarán los registros de `CalendarEvent` del usuario.
- **RF-9**: EL SISTEMA presentará todos los nombres de feriados, tooltips, banners y mensajes 100% en español.

---

## Requisitos no funcionales
- **RNF-1 (Disciplina Ponytail)**: La integración debe implementarse usando la API nativa `fetch` del navegador y utilidades puras de TypeScript, sin instalar clientes HTTP externos (como Axios) ni manejadores pesados de estado.
- **RNF-2 (Accesibilidad WCAG AA)**: Los badges y banners festivos deben mantener un contraste de color superior a 4.5:1 y proveer atributos semánticos (`aria-label`) para tecnologías de asistencia.
- **RNF-3 (Estilos Aislados)**: Toda nueva regla de estilo debe residir estrictamente en módulos CSS (`.module.css`) integrándose con la paleta de tokens Soft UI (`var(--accent-primary)`, `var(--bg-subtle)`, etc.).
- **RNF-4 (Rendimiento)**: El renderizado y cálculo de feriados en la cuadrícula debe ser instantáneo y sin recalcular iteraciones pesadas durante los cambios de estado.

---

## Casos límite
- **CL-1 (Navegación rápida de años)**: Si el usuario cambia velozmente entre 2025, 2026 y 2027, el sistema debe evitar condiciones de carrera (race conditions), descartando respuestas obsoletas si el año en vista ya cambió.
- **CL-2 (Años futuros o pasados sin registros)**: Si la API retorna un arreglo vacío (`records: []`), el sistema debe manejarlo pacíficamente sin lanzar excepciones ni alterar la interfaz.
- **CL-3 (Feriados en fin de semana)**: Los feriados que caigan en sábado o domingo deben proyectarse con la misma claridad en la columna correspondiente (SÁB o DOM).

---

## Fuera de alcance
- Modificación o eliminación manual de feriados por parte del usuario (son decretos oficiales inmutables).
- Selección de feriados regionales específicos de Chile (en esta spec se abarcan los feriados de alcance nacional provistos por el endpoint `/public/CL`).
- Soporte para otros países (reservado para futuras especificaciones de internacionalización).

---

## Criterios de finalización
1. Al seleccionar el año 2026 o 2027 en el Sidebar, los feriados del año correspondiente se cargan dinámicamente y se proyectan en la cuadrícula.
2. Caché local operativa en `localStorage` evitando peticiones de red repetitivas.
3. Indicador festivo sutil visible en las celdas correspondientes con tooltip del nombre.
4. Banner destacado en el encabezado del `DayPanel` cuando el día seleccionado es feriado.
5. Los eventos propios del usuario se pueden crear, editar y eliminar normalmente en días feriados.
6. La suite completa de pruebas unitarias de Vitest pasa al 100% (incluyendo nuevas pruebas para el servicio de feriados).
7. Compilación limpia sin errores con `npm run build`.

---

## Dudas abiertas
*Ninguna duda pendiente.*

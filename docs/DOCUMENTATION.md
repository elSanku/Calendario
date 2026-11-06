# Documentación de la Aplicación de Calendario

## 1. Descripción General del Proyecto y Características Principales
Una aplicación web de calendario moderna y responsiva desarrollada con React, Vite y TypeScript. Combina una navegación intuitiva por año y mes con una gestión detallada de la agenda diaria de eventos.

### Características Principales
- **Navegación en Barra Lateral (Sidebar)**: Selector de año con botones de avance/retroceso y contadores dinámicos de eventos por cada mes.
- **Vista de Cuadrícula Mensual**: Diseño de 6 semanas con inicio de semana en lunes, contraste visual para días fuera de mes, indicador de día activo y puntos de colores para días con eventos programados.
- **Panel de Detalle del Día**: Muestra la agenda de la fecha seleccionada, listando los eventos con su horario y menú contextual de opciones.
- **Gestión de Eventos (CRUD)**: Creación, edición y eliminación de eventos mediante ventanas modales interactivas y validación de formularios.
- **Diseño Adaptable (Responsive)**: Interfaz fluida adaptable tanto a pantallas de escritorio como a dispositivos móviles.
- **Interfaz 100% en Español**: Textos, nombres de días, meses y mensajes completamente localizados al español.

---

## 2. Stack Tecnológico
- **Herramienta de Construcción:** Vite
- **Librería de UI:** React 18+
- **Lenguaje:** TypeScript
- **Estilos:** CSS Modules
- **Gestión de Fechas:** `dayjs` (configurado en idioma español)
- **Iconografía:** `lucide-react`
- **Entorno de Pruebas:** Vitest + React Testing Library

---

## 3. Instrucciones de Configuración e Instalación

### Requisitos Previos
- Node.js (versión 18 o superior recomendada)
- npm o pnpm

### Instalación de Dependencias
```bash
npm install
```

### Servidor de Desarrollo
Para iniciar la aplicación localmente con recarga en caliente:
```bash
npm run dev
```

### Compilación para Producción
Para compilar la aplicación optimizada para producción:
```bash
npm run build
```

### Ejecución de Pruebas Unitarias
Para ejecutar las pruebas del proyecto:
```bash
npm run test
```

---

## 4. Guía de Uso
1. **Navegación por Meses y Años**: Utiliza la barra lateral izquierda para alternar entre años mediante las flechas y haz clic en cualquier mes para visualizar su cuadrícula.
2. **Visualizar el Detalle de un Día**: Haz clic sobre cualquier celda de la cuadrícula mensual para desplegar sus eventos en el panel lateral derecho.
3. **Crear un Evento**: Haz clic en el botón flotante `+` ubicado en el panel de detalle, completa los campos requeridos (Título, Fecha, Hora y Descripción opcional) y presiona **Guardar**.
4. **Editar o Eliminar un Evento**: En la tarjeta del evento deseado dentro del panel lateral, haz clic en el icono de opciones (`...`) para abrir el formulario de edición o el diálogo de confirmación de eliminación.

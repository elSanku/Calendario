# Plan Técnico — Spec 004: Perfeccionamiento Visual, Perfiles de Usuario, Header Anti-Colisión y Persistencia Robusta

## 1. Resumen de la Solución
Este plan técnico aborda de forma quirúrgica y definitiva los cuatro focos de mejora identificados en la Spec 004:
1. **Persistencia robusta autoritaria**: Corregir la función `loadEvents` en `src/App.tsx` para eliminar la recombinación de datos semilla (`mockEvents`) una vez que `localStorage` contiene información previa, garantizando que el borrado de cualquier evento persista tras presionar F5.
2. **Header despejado anti-colisión**: Eliminar el botón redundante `+ Nuevo [N]` de la barra superior, redistribuir los anchos y márgenes para prevenir colisiones en pantallas intermedias, y preservar el atajo global de teclado `N` (o `n`) enlazado a la ventana modal de nuevo evento.
3. **Módulo de Perfil de Usuario y Conmutador de Contexto**: Crear el tipo `UserProfile` en `src/types/user.ts` y el componente accesible `UserProfileBadge` con iniciales tipográficas vectoriales, nombre, rol activo (**Personal** o **Trabajo**) y menú desplegable accesible con navegación por teclado y persistencia en `localStorage`.
4. **Atmósfera estética refinada no plana**: Enriquecer los tokens globales en `src/index.css` y el contenedor en `src/App.module.css` con un gradiente ambiental sutil multicapa cálido/piedra, sombras táctiles suaves y diferenciación tonal entre superficies.

---

## 2. Arquitectura Frontend y Componentes

### 2.1 Modelo de Datos y Tipos (`src/types/user.ts`)
Se creará un nuevo archivo modular de tipos para desacoplar la gestión de usuarios:
```typescript
// src/types/user.ts
export type UserProfileRole = 'Personal' | 'Trabajo';

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  activeRole: UserProfileRole;
  availableRoles: UserProfileRole[];
}

export const USER_PROFILE_STORAGE_KEY = 'calendar-user-profile';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Usuario Demo',
  initials: 'UD',
  activeRole: 'Personal',
  availableRoles: ['Personal', 'Trabajo'],
};
```

### 2.2 Componente `UserProfileBadge` (`src/components/UserProfileBadge/`)
Componente modular aislado con su propia carpeta, estilos CSS Modules y suite de pruebas:
- **Estructura**:
  - `src/components/UserProfileBadge/UserProfileBadge.tsx`
  - `src/components/UserProfileBadge/UserProfileBadge.module.css`
  - `src/components/UserProfileBadge/UserProfileBadge.test.tsx`
- **Props**:
  ```typescript
  export interface UserProfileBadgeProps {
    profile?: UserProfile;
    onRoleChange?: (newRole: UserProfileRole) => void;
  }
  ```
- **Comportamiento y Accesibilidad**:
  - Botón disparador con `aria-haspopup="menu"`, `aria-expanded={isOpen}`, avatar circular con iniciales en alto contraste, nombre del usuario (con truncado elíptico en pantallas angostas) y píldora con el rol activo.
  - Menú flotante contextual accesible con `role="menu"` y elementos con `role="menuitemradio"`, `aria-checked={role === profile.activeRole}`.
  - Soporte de cierre por clic fuera del contenedor (mediante listener global con referencia en `useRef`) y mediante la tecla `Escape`.
  - Icono de verificación (`Check`) junto al rol activo.

### 2.3 Refactorización del `Header` (`src/components/Header/`)
- **Remoción del botón redundante**:
  - Eliminar el botón `.newEventBtn` (`+ Nuevo [N]`) del JSX de `Header.tsx` y su clase correspondiente en `Header.module.css`.
  - Retirar la prop `onNewEvent?: () => void` de `HeaderProps` para limpiar la interfaz del componente (la creación rápida permanece en `DayPanel` y en el atajo `N`).
- **Incorporación de `UserProfileBadge`**:
  - Recibir las props `profile?: UserProfile` y `onRoleChange?: (newRole: UserProfileRole) => void` en `HeaderProps`.
  - Renderizar `<UserProfileBadge profile={profile} onRoleChange={onRoleChange} />` en `rightSection`.
- **Esquema Anti-Colisión**:
  - Ajustar el ancho máximo del contenedor del buscador (`.searchContainer`) a `180px - 210px` con `min-width: 0` y `flex-shrink: 1`.
  - Distribuir las tres secciones con `gap: 12px`, asegurando que el título de la fecha y la botonera de navegación central conserven su legibilidad sin provocar desbordamiento horizontal en resoluciones entre 960px y 1200px.
  - En resoluciones móviles (<960px), el badge de perfil oculta el nombre y muestra únicamente el avatar con iniciales y píldora de rol compacta.

### 2.4 Corrección de Persistencia en `src/App.tsx`
- **Diagnóstico del defecto**: Actualmente, `loadEvents` realiza:
  `const combined = [...mockEvents.filter((m) => !storedIds.has(m.id)), ...stored];`
  Esto ocasiona que si un evento de los mocks iniciales es borrado, su ausencia en `storedIds` provoca que el filtro de `mockEvents` lo reinyecte como nuevo al recargar.
- **Corrección quirúrgica**:
  ```typescript
  //INI SPEC-004 - 01
  const loadEvents = (): CalendarEvent[] => {
    try {
      const raw = localStorage.getItem(EVENTS_STORAGE_KEY);
      if (raw !== null) {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Si el usuario ya tiene datos guardados (incluso [] vacío), esa es la fuente autoritaria
          return sanitizeEvents(parsed);
        }
      }
    } catch {
      // Almacenamiento corrupto o inaccesible: fallback seguro
    }
    return mockEvents;
  };
  //FIN SPEC-004 - 01
  ```
- **Persistencia inicial**: Al montar la aplicación por primera vez (cuando `localStorage.getItem(EVENTS_STORAGE_KEY) === null`), el efecto de persistencia guardará de inmediato `mockEvents` en `localStorage`, garantizando que las futuras consultas encuentren la clave creada y nunca reinyecten elementos suprimidos.
- **Gestión de Estado de Perfil**:
  - Se añadirá el estado `userProfile` inicializado mediante función perezosa que lee `localStorage.getItem(USER_PROFILE_STORAGE_KEY)`.
  - Se sincronizará el estado con `localStorage` mediante un `useEffect` específico.
  - Se mantendrá intacto el manejador global `keydown` para la tecla `N` / `n` que abre `EventFormModal`.

### 2.5 Atmósfera Estética Refinada (`src/index.css` y `src/App.module.css`)
- **Tokens de fondo y gradiente ambiental**:
  - En `src/index.css`, enriquecer el fondo base con una sutil mezcla de gradientes radiales cálidos:
    ```css
    /* INI SPEC-004 - 05 */
    body {
      background-color: var(--bg-canvas);
      background-image: 
        radial-gradient(circle at 12% 18%, rgba(200, 90, 50, 0.035) 0%, transparent 45%),
        radial-gradient(circle at 88% 82%, rgba(40, 36, 33, 0.025) 0%, transparent 40%);
      background-attachment: fixed;
    }
    /* FIN SPEC-004 - 05 */
    ```
- **Elevación táctil suave**:
  - Ajustar `--shadow-soft-md` y `--shadow-soft-lg` con múltiples capas difusas de opacidad baja para evitar bordes duros y crear una percepción táctil premium (Soft UI pulido).
- **Diferenciación de superficies**:
  - Asegurar un contraste suave pero definido entre `.calendarCard` (`--bg-surface-elevated`), el panel lateral (`--bg-surface`) y el lienzo exterior (`--bg-canvas`).

---

## 3. Plan de Pruebas Unitarias y de Integración

### 3.1 Suite Unitaria `UserProfileBadge.test.tsx`
Verificará:
1. Renderizado de avatar con iniciales correctas, nombre y rol predeterminado.
2. Apertura del menú desplegable al hacer clic en el disparador.
3. Selección de un nuevo rol disparando la función `onRoleChange` y cerrando el menú.
4. Cierre del menú al presionar la tecla `Escape`.
5. Cierre del menú al hacer clic fuera del componente.
6. Marcado accesible del rol activo con `aria-checked="true"`.

### 3.2 Actualización de Suite Unitaria `Header.test.tsx`
1. Verificar que el Header ya no renderiza el botón redundante `Nuevo` ni el badge de atajo `[N]`.
2. Verificar que el Header renderiza correctamente el componente `UserProfileBadge` con el rol activo.
3. Verificar que los controles de mes (`Mes anterior`, `Hoy`, `Mes siguiente`) y el buscador continúan funcionando al 100%.

### 3.3 Pruebas de Integración en `App.test.tsx`
1. **Flujo de persistencia de borrado real**:
   - Guardar un conjunto de eventos con un mock modificado en `localStorage`.
   - Simular una recarga de la aplicación ejecutando `loadEvents()` con ese estado de `localStorage`.
   - Comprobar que los eventos eliminados no reaparecen.
2. **Flujo del atajo global `N`**:
   - Presionar la tecla `N` sin modales abiertos y verificar que se despliega el modal de creación.
3. **Flujo de conmutador de perfil**:
   - Seleccionar el badge de perfil, cambiar el rol de `Personal` a `Trabajo`.
   - Comprobar que el cambio se refleja en la interfaz y se persiste en `localStorage` bajo `calendar-user-profile`.

---

## 4. Trazabilidad de Marcas de Auditoría
Todas las intervenciones en el código se delimitarán estrictamente con las marcas oficiales de la Spec 004:
- Marcas TypeScript / JSX: `//INI SPEC-004 - NN` y `//FIN SPEC-004 - NN`
- Marcas CSS Modules: `/* INI SPEC-004 - NN */` y `/* FIN SPEC-004 - NN */`
- Las marcas históricas existentes (`SPEC-001`, `SPEC-002`, `SPEC-003`) se mantendrán intactas e inmutables.

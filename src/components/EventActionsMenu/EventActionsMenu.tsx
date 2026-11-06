import React, { useEffect, useId, useRef, useState } from 'react';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import styles from './EventActionsMenu.module.css';

interface EventActionsMenuProps {
  eventTitle: string;
  /** Acción "Editar" (aún sin lógica; opcional). */
  onEdit?: () => void;
  /** Acción "Eliminar" (aún sin lógica; opcional). */
  onDelete?: () => void;
}

// Detección de soporte de APIs modernas (se evalúa una sola vez en el cliente)
const supportsInvokers =
  typeof HTMLButtonElement !== 'undefined' && 'commandForElement' in HTMLButtonElement.prototype;
const supportsFocusGroup =
  typeof HTMLElement !== 'undefined' && 'focusGroup' in HTMLElement.prototype;
const supportsAnchorPositioning =
  typeof CSS !== 'undefined' && CSS.supports?.('position-area', 'block-end');

const MENU_OFFSET = 4;

/**
 * Menú desplegable de acciones para un evento (Editar / Eliminar).
 * Usa la Popover API + Invoker commands para abrir/cerrar con light-dismiss nativo.
 */
export const EventActionsMenu: React.FC<EventActionsMenuProps> = ({
  eventTitle,
  onEdit,
  onDelete,
}) => {
  const uid = useId();
  const triggerId = `${uid}-trigger`;
  const menuId = `${uid}-menu`;

  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const groupRef = useRef<HTMLDivElement>(null);
  // Indica si la última apertura fue por teclado (para enfocar el primer ítem)
  const enterOnOpenRef = useRef(false);
  const [isOpen, setIsOpen] = useState(false);

  const getItems = (): HTMLButtonElement[] =>
    Array.from(groupRef.current?.querySelectorAll<HTMLButtonElement>('button:not(:disabled)') ?? []);

  // Posicionamiento manual cuando el navegador no soporta CSS Anchor Positioning
  const positionFallback = () => {
    const trigger = triggerRef.current;
    const menu = menuRef.current;
    if (!trigger || !menu) return;
    const t = trigger.getBoundingClientRect();
    const m = menu.getBoundingClientRect();
    let top = t.bottom + MENU_OFFSET;
    if (top + m.height > window.innerHeight) top = t.top - m.height - MENU_OFFSET;
    let left = t.right - m.width;
    left = Math.max(MENU_OFFSET, Math.min(left, window.innerWidth - m.width - MENU_OFFSET));
    menu.style.top = `${Math.max(MENU_OFFSET, top)}px`;
    menu.style.left = `${left}px`;
  };

  // Sincroniza aria-expanded, posición y foco en el evento `toggle` del popover
  useEffect(() => {
    const menu = menuRef.current;
    if (!menu) return;
    const handleToggle = (e: Event) => {
      const open = (e as ToggleEvent).newState === 'open';
      setIsOpen(open);
      if (!open) return;
      if (!supportsAnchorPositioning) positionFallback();
      if (enterOnOpenRef.current) {
        enterOnOpenRef.current = false;
        getItems()[0]?.focus();
      }
    };
    menu.addEventListener('toggle', handleToggle);
    return () => menu.removeEventListener('toggle', handleToggle);
  }, []);

  // Rol ARIA y navegación con flechas cuando `focusgroup` no es nativo
  useEffect(() => {
    if (supportsFocusGroup) return;
    const group = groupRef.current;
    if (!group) return;
    group.setAttribute('role', 'menu');
    group.querySelectorAll('button:not([role])').forEach((item) => item.setAttribute('role', 'menuitem'));
  }, []);

  const handleTriggerClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // detail === 0 => clic generado por teclado (Enter / Espacio)
    enterOnOpenRef.current = e.detail === 0;
    if (supportsInvokers) return; // El navegador hace el toggle con commandfor
    e.preventDefault();
    const menu = menuRef.current;
    if (!menu) return;
    if (menu.matches(':popover-open')) {
      menu.hidePopover();
    } else {
      (menu.showPopover as (opts?: { source?: HTMLElement }) => void)({ source: e.currentTarget });
    }
  };

  const handleTriggerKeyDown = (e: React.KeyboardEvent<HTMLButtonElement>) => {
    if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      enterOnOpenRef.current = true;
      triggerRef.current?.click();
    }
  };

  const handleMenuKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (supportsFocusGroup || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return;
    const items = getItems();
    const current = items.indexOf(document.activeElement as HTMLButtonElement);
    if (current < 0) return;
    const next =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? items.length - 1
          : (current + (e.key === 'ArrowUp' ? -1 : 1) + items.length) % items.length;
    e.preventDefault();
    items[next].focus({ preventScroll: true });
  };

  // El hover sigue al foco (sin anillo de foco para puntero)
  const handleItemPointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (document.activeElement !== e.currentTarget) {
      e.currentTarget.focus({ focusVisible: false } as FocusOptions);
    }
  };

  // Ejecuta la acción, cierra el menú y devuelve el foco al disparador
  const runAction = (action?: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
    const fromPointer = e.detail !== 0;
    action?.();
    triggerRef.current?.focus(fromPointer ? ({ focusVisible: false } as FocusOptions) : undefined);
    menuRef.current?.hidePopover();
  };

  return (
    <>
      <button
        ref={triggerRef}
        id={triggerId}
        type="button"
        className={styles.trigger}
        aria-label={`Opciones del evento ${eventTitle}`}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        onClick={handleTriggerClick}
        onKeyDown={handleTriggerKeyDown}
        {...({ commandfor: menuId, command: 'toggle-popover' } as Record<string, string>)}
      >
        <MoreHorizontal size={18} color="#94a3b8" aria-hidden="true" />
      </button>

      {/* Popover inmediatamente después del disparador (evita aria-details implícito) */}
      <div ref={menuRef} id={menuId} popover="auto" className={styles.menu}>
        <div
          ref={groupRef}
          className={styles.group}
          aria-labelledby={triggerId}
          onKeyDown={handleMenuKeyDown}
          {...({ focusgroup: 'menu nomemory' } as Record<string, string>)}
        >
          <button
            type="button"
            className={styles.item}
            onClick={runAction(onEdit)}
            onPointerMove={handleItemPointerMove}
          >
            <Pencil size={15} aria-hidden="true" />
            Editar
          </button>
          <button
            type="button"
            className={`${styles.item} ${styles.danger}`}
            onClick={runAction(onDelete)}
            onPointerMove={handleItemPointerMove}
          >
            <Trash2 size={15} aria-hidden="true" />
            Eliminar
          </button>
        </div>
      </div>
    </>
  );
};


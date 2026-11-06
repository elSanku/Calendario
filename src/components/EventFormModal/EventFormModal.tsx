import React, { useEffect, useRef, useState, useCallback } from 'react';
import dayjs from 'dayjs';
import { X } from 'lucide-react';
//INI SPEC-003 - 02
// Tipos de categorías y resolución para el modal
import type { CalendarEvent, EventCategory } from '../../types/calendar';
import { resolveEventCategory, DEFAULT_CATEGORY } from '../../utils/categoryUtils';
//FIN SPEC-003 - 02
import { ConfirmDialog } from '../ConfirmDialog/ConfirmDialog';
import { parseEventTime, type EventFormValues } from '../../utils/eventValidation';
import { EventForm } from './EventForm';
import styles from './EventFormModal.module.css';

//INI SPEC-003 - 02
// Interfaz de nuevo evento con categoría tipada
export type NewEventData = Omit<CalendarEvent, 'id'> & {
  category?: EventCategory;
};
//FIN SPEC-003 - 02

export interface EventFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (event: NewEventData) => void;
  /** Evento a editar; si se omite, el modal funciona en modo creación. */
  event?: CalendarEvent | null;
  /** Fecha inicial en modo creación (por defecto, hoy). */
  defaultDate?: string;
  /** Eventos existentes, para advertir posibles duplicados. */
  existingEvents?: CalendarEvent[];
}

/** Modal para crear o editar un evento, basado en el elemento nativo <dialog>. */
export const EventFormModal: React.FC<EventFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  event,
  defaultDate,
  existingEvents = [],
}) => {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const dirtyRef = useRef(false);
  const [confirmDiscard, setConfirmDiscard] = useState(false);

  // Sincroniza el estado `isOpen` con el diálogo nativo (modal)
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) dialog.showModal();
    if (!isOpen && dialog.open) dialog.close();
    if (!isOpen) dirtyRef.current = false;
  }, [isOpen]);

  const handleDirtyChange = useCallback((dirty: boolean) => {
    dirtyRef.current = dirty;
  }, []);

  // Si hay cambios sin guardar, pide confirmación antes de cerrar
  const requestClose = () => {
    if (dirtyRef.current) setConfirmDiscard(true);
    else onClose();
  };

  // Esc / clic fuera disparan `cancel`: se intercepta para no perder cambios
  const handleCancel = (e: React.SyntheticEvent<HTMLDialogElement>) => {
    e.preventDefault();
    requestClose();
  };

  const { startTime, endTime } = parseEventTime(event?.time);

  const initialValues: EventFormValues = {
    title: event?.title ?? '',
    description: event?.description ?? '',
    date: event?.date ?? defaultDate ?? dayjs().format('YYYY-MM-DD'),
    startTime,
    endTime,
    //INI SPEC-003 - 02
    // Inicialización de categoría de evento o por defecto 'work'
    category: event ? resolveEventCategory(event) : DEFAULT_CATEGORY,
    //FIN SPEC-003 - 02
  };

  return (
    <dialog
      ref={dialogRef}
      className={styles.dialog}
      aria-labelledby="event-modal-title"
      // Cierre con Esc / clic fuera (progressive enhancement)
      {...({ closedby: 'any' } as Record<string, string>)}
      onCancel={handleCancel}
      onClose={() => isOpen && onClose()}
    >
      <div className={styles.header}>
        <h2 id="event-modal-title" className={styles.title}>
          {event ? 'Editar evento' : 'Nuevo evento'}
        </h2>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={requestClose}
          aria-label="Cerrar"
        >
          <X size={18} aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <EventForm
          key={event?.id ?? 'new'}
          initialValues={initialValues}
          event={event}
          existingEvents={existingEvents}
          onCancel={requestClose}
          onSave={onSave}
          onDirtyChange={handleDirtyChange}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDiscard}
        title="Descartar cambios"
        message="Tienes cambios sin guardar. ¿Deseas descartarlos?"
        onCancel={() => setConfirmDiscard(false)}
        onConfirm={() => {
          setConfirmDiscard(false);
          onClose();
        }}
      />
    </dialog>
  );
};

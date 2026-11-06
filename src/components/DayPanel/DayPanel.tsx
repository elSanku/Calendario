import React from 'react';
import { Plus } from 'lucide-react';
import { EventActionsMenu } from '../EventActionsMenu/EventActionsMenu';
import type { CalendarEvent } from '../../types/calendar';
import { formatDayPanelHeader } from '../../utils/dateUtils';
import styles from './DayPanel.module.css';

interface DayPanelProps {
  selectedDateStr: string;
  events: CalendarEvent[];
  onAddEventClick?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

//INI SPEC-001 - 06
// Panel de detalle del día Soft UI con acento terracota, truncado de textos y botón táctil
export const DayPanel: React.FC<DayPanelProps> = ({
  selectedDateStr,
  events,
  onAddEventClick,
  onEditEvent,
  onDeleteEvent,
}) => {
  const { title, subtitle } = formatDayPanelHeader(selectedDateStr);

  return (
    <aside className={styles.dayPanel} aria-label="Detalle del día seleccionado">
      {/* Encabezado con fecha en grande y día en terracota */}
      <div className={styles.panelHeader}>
        <h2 className={styles.monthDayTitle}>{title}</h2>
        <span className={styles.weekdaySubtitle}>{subtitle}</span>
      </div>

      {/* Lista de eventos del día */}
      <div className={styles.eventsContainer}>
        {events.length === 0 ? (
          <div className={styles.emptyState}>
            <p>No hay eventos programados para este día.</p>
          </div>
        ) : (
          <ul className={styles.eventList}>
            {events.map((evt) => (
              <li
                key={evt.id}
                className={styles.eventCard}
                style={{ borderLeftColor: evt.color || 'var(--accent-primary)' }}
              >
                <div className={styles.eventInfo}>
                  <h4 className={styles.eventTitle} title={evt.title}>
                    {evt.title}
                  </h4>
                  <span className={styles.eventTime}>{evt.time ?? 'Todo el día'}</span>
                </div>
                {/* Menú desplegable con acciones Editar / Eliminar */}
                <EventActionsMenu
                  eventTitle={evt.title}
                  onEdit={() => onEditEvent?.(evt)}
                  onDelete={() => onDeleteEvent?.(evt)}
                />
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Botón flotante circular + con acento terracota */}
      <button
        type="button"
        className={styles.fabAdd}
        onClick={onAddEventClick}
        aria-label="Agregar nuevo evento"
      >
        <Plus size={22} color="var(--accent-contrast)" />
      </button>
    </aside>
  );
};
//FIN SPEC-001 - 06

import React from 'react';
//INI SPEC-002 - 05
// Importación de icono conmemorativo y tipos de feriado
import { Plus, Sparkles } from 'lucide-react';
import type { Holiday } from '../../types/holiday';
//FIN SPEC-002 - 05
//INI SPEC-003 - 06
// Iconos y utilidades para línea de tiempo y categorías
import { RotateCcw } from 'lucide-react';
import { getCategoryMeta, resolveEventCategory } from '../../utils/categoryUtils';
//FIN SPEC-003 - 06
import { EventActionsMenu } from '../EventActionsMenu/EventActionsMenu';
import type { CalendarEvent } from '../../types/calendar';
import { formatDayPanelHeader } from '../../utils/dateUtils';
import styles from './DayPanel.module.css';

interface DayPanelProps {
  selectedDateStr: string;
  events: CalendarEvent[];
  //INI SPEC-002 - 05
  // Feriado nacional del día seleccionado si existe
  holiday?: Holiday | null;
  //FIN SPEC-002 - 05
  //INI SPEC-003 - 06
  // Filtros activos y acción de restablecimiento
  hasActiveFilters?: boolean;
  onResetFilters?: () => void;
  //FIN SPEC-003 - 06
  onAddEventClick?: () => void;
  onEditEvent?: (event: CalendarEvent) => void;
  onDeleteEvent?: (event: CalendarEvent) => void;
}

//INI SPEC-001 - 06
// Panel de detalle del día Soft UI con acento terracota, truncado de textos y botón táctil
export const DayPanel: React.FC<DayPanelProps> = ({
  selectedDateStr,
  events,
  //INI SPEC-002 - 05
  holiday,
  //FIN SPEC-002 - 05
  //INI SPEC-003 - 06
  hasActiveFilters = false,
  onResetFilters,
  //FIN SPEC-003 - 06
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

      {/* INI SPEC-002 - 05 */}
      {/* Banner conmemorativo si la fecha seleccionada es feriado nacional */}
      {holiday && (
        <div
          className={styles.holidayBanner}
          role="region"
          aria-label={`Feriado nacional: ${holiday.title}`}
          data-testid="holiday-banner"
        >
          <div className={styles.bannerTagRow}>
            <Sparkles size={14} className={styles.bannerIcon} aria-hidden="true" />
            <span className={styles.bannerTag}>Feriado Oficial</span>
          </div>
          <h3 className={styles.bannerTitle}>{holiday.title}</h3>
        </div>
      )}
      {/* FIN SPEC-002 - 05 */}

      {/* INI SPEC-003 - 06 */}
      {/* Lista de eventos del día como línea de tiempo estructurada con categorías semánticas */}
      <div className={styles.eventsContainer}>
        {events.length === 0 ? (
          <div className={styles.emptyState}>
            {hasActiveFilters ? (
              <>
                <p className={styles.emptyStateMessage}>
                  No hay eventos que coincidan con los filtros o búsqueda activa.
                </p>
                {onResetFilters && (
                  <button
                    type="button"
                    className={styles.emptyStateBtn}
                    onClick={onResetFilters}
                  >
                    <RotateCcw size={14} aria-hidden="true" />
                    <span>Restablecer filtros</span>
                  </button>
                )}
              </>
            ) : (
              <>
                <p className={styles.emptyStateMessage}>
                  No hay eventos programados para este día.
                </p>
                {onAddEventClick && (
                  <button
                    type="button"
                    className={styles.emptyStateBtn}
                    onClick={onAddEventClick}
                  >
                    <Plus size={14} aria-hidden="true" />
                    <span>Programar evento</span>
                  </button>
                )}
              </>
            )}
          </div>
        ) : (
          <ol className={styles.timelineList}>
            {events.map((evt) => {
              const categoryKey = resolveEventCategory(evt);
              const meta = getCategoryMeta(categoryKey);
              const timeDisplay = evt.time ? evt.time : 'Todo el día';

              return (
                <li key={evt.id} className={styles.timelineItem}>
                  {/* Conector visual de línea de tiempo */}
                  <div className={styles.timelineTrack} aria-hidden="true">
                    <span
                      className={styles.timelineDot}
                      style={{ backgroundColor: meta.dotVar }}
                    />
                    <span className={styles.timelineLine} />
                  </div>

                  {/* Tarjeta de evento */}
                  <article
                    className={styles.eventCard}
                    style={{ borderLeftColor: evt.color || meta.color }}
                  >
                    <div className={styles.eventCardHeader}>
                      <span
                        className={styles.categoryBadge}
                        style={{
                          backgroundColor: meta.bgVar,
                          color: meta.textVar,
                        }}
                      >
                        <span
                          className={styles.categoryBadgeDot}
                          style={{ backgroundColor: meta.dotVar }}
                          aria-hidden="true"
                        />
                        {meta.label}
                      </span>
                      <EventActionsMenu
                        eventTitle={evt.title}
                        onEdit={() => onEditEvent?.(evt)}
                        onDelete={() => onDeleteEvent?.(evt)}
                      />
                    </div>

                    <div className={styles.eventCardBody}>
                      <h4 className={styles.eventTitle} title={evt.title}>
                        {evt.title}
                      </h4>
                      <div className={styles.timeBadge}>
                        <span className={styles.timeText}>{timeDisplay}</span>
                      </div>
                      {evt.description && (
                        <p className={styles.eventDescription}>
                          {evt.description}
                        </p>
                      )}
                    </div>
                  </article>
                </li>
              );
            })}
          </ol>
        )}
      </div>
      {/* FIN SPEC-003 - 06 */}

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

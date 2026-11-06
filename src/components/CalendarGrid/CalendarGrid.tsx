import React, { useEffect, useRef, useState } from 'react';
import dayjs from 'dayjs';
import 'dayjs/locale/es';
import type { CalendarEvent, DayCell } from '../../types/calendar';
import { WEEKDAYS_ES } from '../../utils/dateUtils';
//INI SPEC-003 - 05
// Importación de utilidades de categoría, metadatos y extracción horaria tabular
import { extractStartTime, getCategoryMeta, resolveEventCategory } from '../../utils/categoryUtils';
//FIN SPEC-003 - 05
import styles from './CalendarGrid.module.css';

//INI SPEC-003 - 05
// Extensión de CalendarGridProps con onEditEvent opcional
export interface CalendarGridProps {
  cells: DayCell[];
  onSelectDay: (dateStr: string) => void;
  onEditEvent?: (event: CalendarEvent) => void;
}
//FIN SPEC-003 - 05

//INI SPEC-001 - 05
// Cuadrícula de 42 celdas Soft UI con acento terracota, soporte de teclado y límite +N
//INI SPEC-003 - 05
// Rediseño con chips horizontales de eventos, hora tabular y popover contextual flotante +N más
export const CalendarGrid: React.FC<CalendarGridProps> = ({ cells, onSelectDay, onEditEvent }) => {
  const [openPopoverDate, setOpenPopoverDate] = useState<string | null>(null);
  const popoverRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!openPopoverDate) return;

    const handleDocumentKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.stopPropagation();
        setOpenPopoverDate(null);
      }
    };

    const handleDocumentClick = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setOpenPopoverDate(null);
      }
    };

    document.addEventListener('keydown', handleDocumentKeyDown);
    document.addEventListener('mousedown', handleDocumentClick);

    return () => {
      document.removeEventListener('keydown', handleDocumentKeyDown);
      document.removeEventListener('mousedown', handleDocumentClick);
    };
  }, [openPopoverDate]);

  const handleOpenPopover = (e: React.MouseEvent, date: string) => {
    e.stopPropagation();
    onSelectDay(date);
    setOpenPopoverDate((prev) => (prev === date ? null : date));
  };
  //FIN SPEC-003 - 05

  const handleKeyDown = (e: React.KeyboardEvent, date: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onSelectDay(date);
    }
  };

  return (
    <div className={styles.gridContainer}>
      {/* Cabecera de días de la semana iniciando en Lunes */}
      <div className={styles.weekHeader}>
        {WEEKDAYS_ES.map((day) => (
          <div key={day} className={styles.weekdayName}>
            {day}
          </div>
        ))}
      </div>

      {/* Cuadrícula uniforme de 6 semanas (42 celdas exactas) */}
      <div className={styles.daysGrid} role="grid" aria-label="Cuadrícula del mes">
        {cells.map((cell, index) => {
          //INI SPEC-003 - 05
          const isPopoverOpen = openPopoverDate === cell.date;
          const colIndex = index % 7;
          const rowIndex = Math.floor(index / 7);
          const formattedDate = dayjs(cell.date).format('D [de] MMMM');
          //FIN SPEC-003 - 05

          const cellClass = [
            styles.dayCell,
            !cell.isCurrentMonth ? styles.otherMonth : '',
            cell.isSelected ? styles.selected : '',
            cell.isToday ? styles.today : '',
            //INI SPEC-002 - 04
            // Clase para destacar los días feriados con fondo ámbar claro
            cell.holiday ? styles.holidayCell : '',
            //FIN SPEC-002 - 04
            //INI SPEC-003 - 05
            isPopoverOpen ? styles.popoverOpen : '',
            //FIN SPEC-003 - 05
          ]
            .filter(Boolean)
            .join(' ');

          const eventCount = cell.events.length;
          //INI SPEC-002 - 04
          // Enriquecer label accesible con información del feriado si existe
          const holidayLabel = cell.holiday ? `, Feriado: ${cell.holiday.title}` : '';
          const label = `${cell.dayNumber}${holidayLabel}${eventCount > 0 ? `, ${eventCount} evento(s)` : ''}${cell.isToday ? ', Hoy' : ''}`;
          //FIN SPEC-002 - 04

          return (
            <div
              key={cell.date}
              className={cellClass}
              onClick={() => onSelectDay(cell.date)}
              onKeyDown={(e) => handleKeyDown(e, cell.date)}
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={cell.isSelected}
            >
              {/* INI SPEC-002 - 04 */}
              {/* Cabecera de celda con número y píldora sutil de feriado */}
              <div className={styles.cellHeader}>
                <span className={styles.dayNumber}>{cell.dayNumber}</span>
                {cell.holiday && (
                  <span
                    className={`${styles.holidayPill} ${cell.isSelected ? styles.holidayPillSelected : ''}`}
                    title={`Feriado: ${cell.holiday.title}`}
                    data-testid="holiday-pill"
                  >
                    <span className={styles.holidayDot} aria-hidden="true" />
                    <span className={styles.holidayText}>{cell.holiday.title}</span>
                  </span>
                )}
              </div>
              {/* FIN SPEC-002 - 04 */}

              {/* INI SPEC-003 - 05 */}
              {/* Chips horizontales de eventos (máximo 2 visibles) y botón +N más */}
              {eventCount > 0 && (
                <div className={styles.chipsContainer}>
                  {cell.events.slice(0, 2).map((event) => {
                    const meta = getCategoryMeta(resolveEventCategory(event));
                    const startTime = extractStartTime(event.time);
                    return (
                      <div
                        key={event.id}
                        className={styles.eventChip}
                        style={{
                          backgroundColor: meta.bgVar,
                          color: meta.textVar,
                          borderLeftColor: meta.color,
                        }}
                        title={`${event.title}${event.time ? ` (${event.time})` : ''}`}
                        data-testid="event-chip"
                      >
                        {startTime && <span className={styles.chipTime}>{startTime}</span>}
                        <span className={styles.chipTitle}>{event.title}</span>
                      </div>
                    );
                  })}
                  {eventCount > 2 && (
                    <button
                      type="button"
                      className={styles.moreChipBtn}
                      onClick={(e) => handleOpenPopover(e, cell.date)}
                      onKeyDown={(e) => e.stopPropagation()}
                      aria-haspopup="dialog"
                      aria-expanded={isPopoverOpen}
                      data-testid="more-chip-btn"
                    >
                      +{eventCount - 2} más
                    </button>
                  )}
                </div>
              )}

              {/* Popover contextual flotante para la celda con más eventos abierta */}
              {isPopoverOpen && (
                <div
                  ref={popoverRef}
                  className={`${styles.morePopover} ${colIndex >= 4 ? styles.popoverAlignRight : ''} ${rowIndex >= 4 ? styles.popoverAlignBottom : ''}`}
                  role="dialog"
                  aria-label={`Eventos del ${formattedDate}`}
                  onClick={(e) => e.stopPropagation()}
                  data-testid="more-popover"
                >
                  <div className={styles.popoverHeader}>
                    <span className={styles.popoverTitle}>{formattedDate}</span>
                    <button
                      type="button"
                      className={styles.popoverCloseBtn}
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenPopoverDate(null);
                      }}
                      aria-label="Cerrar lista de eventos"
                      data-testid="popover-close-btn"
                    >
                      ×
                    </button>
                  </div>
                  <div className={styles.popoverEventsList}>
                    {cell.events.map((event) => {
                      const meta = getCategoryMeta(resolveEventCategory(event));
                      const startTime = extractStartTime(event.time);
                      return (
                        <div
                          key={event.id}
                          className={styles.popoverEventItem}
                          style={{
                            backgroundColor: meta.bgVar,
                            color: meta.textVar,
                            borderLeftColor: meta.color,
                          }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDay(cell.date);
                            if (onEditEvent) {
                              setOpenPopoverDate(null);
                              onEditEvent(event);
                            }
                          }}
                          role={onEditEvent ? 'button' : undefined}
                          tabIndex={onEditEvent ? 0 : undefined}
                          onKeyDown={
                            onEditEvent
                              ? (e) => {
                                  if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setOpenPopoverDate(null);
                                    onEditEvent(event);
                                  }
                                }
                              : undefined
                          }
                        >
                          <div className={styles.popoverEventInfo}>
                            {startTime && <span className={styles.chipTime}>{startTime}</span>}
                            <span className={styles.popoverEventTitle}>{event.title}</span>
                          </div>
                          {onEditEvent && (
                            <button
                              type="button"
                              className={styles.popoverEditBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                setOpenPopoverDate(null);
                                onEditEvent(event);
                              }}
                              aria-label={`Editar ${event.title}`}
                            >
                              Editar
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
              {/* FIN SPEC-003 - 05 */}
            </div>
          );
        })}
      </div>
    </div>
  );
};
//FIN SPEC-001 - 05

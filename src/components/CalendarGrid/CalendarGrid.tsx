import React from 'react';
import type { DayCell } from '../../types/calendar';
import { WEEKDAYS_ES } from '../../utils/dateUtils';
import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  cells: DayCell[];
  onSelectDay: (dateStr: string) => void;
}

//INI SPEC-001 - 05
// Cuadrícula de 42 celdas Soft UI con acento terracota, soporte de teclado y límite +N
export const CalendarGrid: React.FC<CalendarGridProps> = ({ cells, onSelectDay }) => {
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
        {cells.map((cell) => {
          const cellClass = [
            styles.dayCell,
            !cell.isCurrentMonth ? styles.otherMonth : '',
            cell.isSelected ? styles.selected : '',
            cell.isToday ? styles.today : '',
            //INI SPEC-002 - 04
            // Clase para destacar los días feriados con fondo ámbar claro
            cell.holiday ? styles.holidayCell : '',
            //FIN SPEC-002 - 04
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

              {/* Puntos (dots) de eventos y badge +N si hay saturación */}
              {eventCount > 0 && (
                <div className={styles.dotsContainer}>
                  {cell.events.slice(0, 3).map((event) => (
                    <span
                      key={event.id}
                      className={styles.eventDot}
                      style={{
                        backgroundColor: cell.isSelected ? '#ffffff' : event.color || '#e74c3c',
                      }}
                    />
                  ))}
                  {eventCount > 3 && (
                    <span className={`${styles.moreCount} ${cell.isSelected ? styles.moreCountSelected : ''}`}>
                      +{eventCount - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
//FIN SPEC-001 - 05

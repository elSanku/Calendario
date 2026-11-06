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
          ]
            .filter(Boolean)
            .join(' ');

          const eventCount = cell.events.length;
          const label = `${cell.dayNumber}${eventCount > 0 ? `, ${eventCount} evento(s)` : ''}${cell.isToday ? ', Hoy' : ''}`;

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
              <span className={styles.dayNumber}>{cell.dayNumber}</span>

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

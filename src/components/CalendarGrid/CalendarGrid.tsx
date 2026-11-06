import React from 'react';
import type { DayCell } from '../../types/calendar';
import { WEEKDAYS_ES } from '../../utils/dateUtils';
import styles from './CalendarGrid.module.css';

interface CalendarGridProps {
  cells: DayCell[];
  onSelectDay: (dateStr: string) => void;
}

export const CalendarGrid: React.FC<CalendarGridProps> = ({ cells, onSelectDay }) => {
  return (
    <div className={styles.gridContainer}>
      {/* Cabecera de días de la semana */}
      <div className={styles.weekHeader}>
        {WEEKDAYS_ES.map((day) => (
          <div key={day} className={styles.weekdayName}>
            {day}
          </div>
        ))}
      </div>

      {/* Celdas de días (6 semanas = 42 celdas) */}
      <div className={styles.daysGrid}>
        {cells.map((cell) => {
          const cellClass = [
            styles.dayCell,
            !cell.isCurrentMonth ? styles.otherMonth : '',
            cell.isSelected ? styles.selected : '',
            cell.isToday ? styles.today : '',
          ]
            .filter(Boolean)
            .join(' ');

          return (
            <div
              key={cell.date}
              className={cellClass}
              onClick={() => onSelectDay(cell.date)}
              role="button"
              tabIndex={0}
            >
              <span className={styles.dayNumber}>{cell.dayNumber}</span>

              {/* Puntos (dots) de eventos */}
              {cell.events.length > 0 && (
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

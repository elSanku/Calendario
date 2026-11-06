import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES_ES } from '../../utils/dateUtils';
import styles from './Sidebar.module.css';

interface SidebarProps {
  year: number;
  selectedMonth: number;
  eventCounts: number[];
  onYearChange: (newYear: number) => void;
  onMonthSelect: (monthIndex: number) => void;
}

//INI SPEC-001 - 04
// Sidebar con diseño Soft UI, acentos terracota y soporte de teclado accesible
export const Sidebar: React.FC<SidebarProps> = ({
  year,
  selectedMonth,
  eventCounts,
  onYearChange,
  onMonthSelect,
}) => {
  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onMonthSelect(index);
    }
  };

  return (
    <aside className={styles.sidebar} aria-label="Navegación de fechas">
      {/* Selector de Año con botones táctiles */}
      <div className={styles.yearSelector}>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => onYearChange(year - 1)}
          aria-label="Año anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <span className={styles.yearText}>{year}</span>
        <button
          type="button"
          className={styles.navBtn}
          onClick={() => onYearChange(year + 1)}
          aria-label="Año siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Lista de los 12 meses */}
      <ul className={styles.monthList} role="listbox" aria-label="Meses del año">
        {MONTH_NAMES_ES.map((name, index) => {
          const isSelected = index === selectedMonth;
          const count = eventCounts[index] || 0;

          return (
            <li
              key={name}
              className={`${styles.monthItem} ${isSelected ? styles.active : ''}`}
              onClick={() => onMonthSelect(index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              role="button"
              tabIndex={0}
              aria-selected={isSelected}
            >
              <span className={styles.monthName}>{name}</span>
              {count > 0 && (
                <span
                  className={`${styles.eventBadge} ${isSelected ? styles.badgeActive : ''}`}
                  aria-label={`${count} eventos`}
                >
                  {count}
                </span>
              )}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};
//FIN SPEC-001 - 04

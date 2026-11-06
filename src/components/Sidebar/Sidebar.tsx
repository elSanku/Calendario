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

export const Sidebar: React.FC<SidebarProps> = ({
  year,
  selectedMonth,
  eventCounts,
  onYearChange,
  onMonthSelect,
}) => {
  return (
    <aside className={styles.sidebar}>
      {/* Controles de Año */}
      <div className={styles.yearSelector}>
        <button
          className={styles.navBtn}
          onClick={() => onYearChange(year - 1)}
          aria-label="Año anterior"
        >
          <ChevronLeft size={18} />
        </button>
        <span className={styles.yearText}>{year}</span>
        <button
          className={styles.navBtn}
          onClick={() => onYearChange(year + 1)}
          aria-label="Año siguiente"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Lista de Meses */}
      <ul className={styles.monthList}>
        {MONTH_NAMES_ES.map((name, index) => {
          const isSelected = index === selectedMonth;
          const count = eventCounts[index] || 0;

          return (
            <li
              key={name}
              className={`${styles.monthItem} ${isSelected ? styles.active : ''}`}
              onClick={() => onMonthSelect(index)}
              role="button"
              tabIndex={0}
            >
              <span className={styles.monthName}>{name}</span>
              {count > 0 && <span className={styles.eventBadge}>{count}</span>}
            </li>
          );
        })}
      </ul>
    </aside>
  );
};

import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MONTH_NAMES_ES } from '../../utils/dateUtils';
//INI SPEC-003 - 03
// Importación de tipos de categorías y catálogo oficial
import type { EventCategory } from '../../types/calendar';
import { EVENT_CATEGORIES, ALL_CATEGORIES } from '../../utils/categoryUtils';
//FIN SPEC-003 - 03
import styles from './Sidebar.module.css';

interface SidebarProps {
  year: number;
  selectedMonth: number;
  eventCounts: number[];
  onYearChange: (newYear: number) => void;
  onMonthSelect: (monthIndex: number) => void;
  //INI SPEC-003 - 03
  // Filtros interactivos por categoría opcionales
  activeCategories?: EventCategory[];
  onToggleCategory?: (category: EventCategory) => void;
  //FIN SPEC-003 - 03
}

//INI SPEC-001 - 04
// Sidebar con diseño Soft UI, acentos terracota y soporte de teclado accesible
export const Sidebar: React.FC<SidebarProps> = ({
  year,
  selectedMonth,
  eventCounts,
  onYearChange,
  onMonthSelect,
  //INI SPEC-003 - 03
  // Propiedades de categorías con valores por defecto
  activeCategories = ALL_CATEGORIES,
  onToggleCategory,
  //FIN SPEC-003 - 03
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

      {/* INI SPEC-003 - 03 */}
      {/* Sección de filtros interactivos por categoría */}
      <div className={styles.categoriesSection}>
        <div className={styles.sectionTitle}>Categorías</div>
        <div className={styles.categoriesList} role="group" aria-label="Filtro de categorías">
          {EVENT_CATEGORIES.map((cat) => {
            const isActive = activeCategories.includes(cat.id);
            return (
              <button
                key={cat.id}
                type="button"
                role="switch"
                aria-checked={isActive}
                aria-label={`Filtrar ${cat.label}`}
                className={`${styles.categoryToggleBtn} ${isActive ? styles.categoryToggleActive : ''}`}
                onClick={() => onToggleCategory?.(cat.id)}
              >
                <span
                  className={styles.categoryToggleDot}
                  style={{ backgroundColor: cat.color }}
                  aria-hidden="true"
                />
                <span className={styles.categoryToggleLabel}>{cat.label}</span>
                <span
                  className={`${styles.categorySwitchTrack} ${isActive ? styles.switchTrackActive : ''}`}
                  aria-hidden="true"
                >
                  <span className={styles.categorySwitchThumb} />
                </span>
              </button>
            );
          })}
        </div>
      </div>
      {/* FIN SPEC-003 - 03 */}
    </aside>
  );
};
//FIN SPEC-001 - 04

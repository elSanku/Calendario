import React from 'react';
import dayjs from 'dayjs';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Search, X } from 'lucide-react';
import { MONTH_NAMES_ES } from '../../utils/dateUtils';
import styles from './Header.module.css';

//INI SPEC-003 - 04
// Props para el Header de productividad: navegación de meses, buscador interactivo y acción rápida
export interface HeaderProps {
  currentMonthIndex?: number;
  currentYear?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  onPrevMonth?: () => void;
  onNextMonth?: () => void;
  onToday?: () => void;
  onNewEvent?: () => void;
}
//FIN SPEC-003 - 04

//INI SPEC-001 - 03
// Header con diseño Soft UI y acentos terracota
//INI SPEC-003 - 04
// Rediseño de productividad: navegación rápida, mes/año dinámico, buscador interactivo y acción rápida
export const Header: React.FC<HeaderProps> = ({
  currentMonthIndex = dayjs().month(),
  currentYear = dayjs().year(),
  searchQuery = '',
  onSearchChange,
  onPrevMonth,
  onNextMonth,
  onToday,
  onNewEvent,
}) => {
  const monthName = MONTH_NAMES_ES[currentMonthIndex] ?? 'Enero';

  return (
    <header className={styles.header}>
      {/* Sección Izquierda: Logotipo del Calendario y Mes/Año Activo */}
      <div className={styles.leftSection}>
        <div className={styles.brand}>
          <div className={styles.logoIcon}>
            <CalendarIcon size={20} className={styles.brandIcon} />
          </div>
          <span className={styles.brandName}>Calendario</span>
        </div>

        <div className={styles.divider} aria-hidden="true" />

        <h1 className={styles.currentDateTitle}>
          <span className={styles.monthName}>{monthName}</span>
          <span className={styles.yearNumber}>{currentYear}</span>
        </h1>
      </div>

      {/* Sección Central: Navegación rápida entre meses */}
      <nav className={styles.navGroup} aria-label="Navegación de mes">
        <button
          type="button"
          className={styles.navBtn}
          onClick={onPrevMonth}
          aria-label="Mes anterior"
          title="Mes anterior"
        >
          <ChevronLeft size={18} aria-hidden="true" />
        </button>
        <button
          type="button"
          className={styles.todayBtn}
          onClick={onToday}
          aria-label="Ir a hoy"
        >
          Hoy
        </button>
        <button
          type="button"
          className={styles.navBtn}
          onClick={onNextMonth}
          aria-label="Mes siguiente"
          title="Mes siguiente"
        >
          <ChevronRight size={18} aria-hidden="true" />
        </button>
      </nav>

      {/* Sección Derecha: Buscador de eventos y botón de nuevo evento */}
      <div className={styles.rightSection}>
        <div className={styles.searchContainer}>
          <Search size={15} className={styles.searchIcon} aria-hidden="true" />
          <input
            type="search"
            className={styles.searchInput}
            placeholder="Buscar eventos..."
            aria-label="Buscar eventos"
            value={searchQuery}
            onChange={(e) => onSearchChange?.(e.target.value)}
          />
          {Boolean(searchQuery) && (
            <button
              type="button"
              className={styles.clearSearchBtn}
              onClick={() => onSearchChange?.('')}
              aria-label="Limpiar búsqueda"
              title="Limpiar búsqueda"
            >
              <X size={14} aria-hidden="true" />
            </button>
          )}
        </div>

        <button
          type="button"
          className={styles.newEventBtn}
          onClick={onNewEvent}
          aria-label="Nuevo"
          title="Crear nuevo evento (N)"
        >
          <Plus size={16} aria-hidden="true" />
          <span>Nuevo</span>
          <kbd className={styles.shortcutBadge} aria-hidden="true">N</kbd>
        </button>
      </div>
    </header>
  );
};
//FIN SPEC-003 - 04
//FIN SPEC-001 - 03

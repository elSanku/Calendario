import React from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      {/* Logotipo estilo CLDR */}
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <CalendarIcon size={20} color="#1abc9c" />
        </div>
        <span className={styles.brandName}>CLDR</span>
      </div>

      {/* Enlaces de navegación */}
      <nav className={styles.navigation}>
        <a href="#hoy" className={styles.navLink}>
          Hoy
        </a>
        <a href="#calendario" className={`${styles.navLink} ${styles.activeLink}`}>
          Calendario
        </a>
        <a href="#organizar" className={styles.navLink}>
          Organizar
        </a>
      </nav>

      {/* Perfil de usuario y avatar */}
      <div className={styles.userSection}>
        <button className={styles.dropdownBtn} aria-label="Menú de usuario">
          <ChevronDown size={18} color="#666" />
        </button>
        <div className={styles.avatar}>
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
            alt="Usuario"
          />
        </div>
      </div>
    </header>
  );
};


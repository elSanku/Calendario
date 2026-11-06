import React from 'react';
import { Calendar as CalendarIcon, ChevronDown } from 'lucide-react';
import styles from './Header.module.css';

//INI SPEC-001 - 03
// Header con diseño Soft UI y acentos terracota
export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      {/* Logotipo del Calendario */}
      <div className={styles.brand}>
        <div className={styles.logoIcon}>
          <CalendarIcon size={20} className={styles.brandIcon} />
        </div>
        <span className={styles.brandName}>Calendario</span>
      </div>

      {/* Enlaces de navegación */}
      <nav className={styles.navigation} aria-label="Navegación principal">
        <a href="#hoy" className={styles.navLink}>
          Hoy
        </a>
        <a href="#calendario" className={`${styles.navLink} ${styles.activeLink}`} aria-current="page">
          Calendario
        </a>
        <a href="#organizar" className={styles.navLink}>
          Organizar
        </a>
      </nav>

      {/* Perfil de usuario y avatar */}
      <div className={styles.userSection}>
        <button className={styles.dropdownBtn} aria-label="Menú de usuario" type="button">
          <ChevronDown size={18} className={styles.chevronIcon} />
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
//FIN SPEC-001 - 03

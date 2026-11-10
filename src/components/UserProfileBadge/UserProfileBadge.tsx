//INI SPEC-004 - 02
// Componente accesible UserProfileBadge con avatar, nombre, rol activo y menú conmutador
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
//INI SPEC-005 - 03
// Iconos Sun y Moon para opciones de tema visual y tipo AppTheme
import { Sun, Moon } from 'lucide-react';
import type { AppTheme } from '../../types/theme';
//FIN SPEC-005 - 03
import { DEFAULT_USER_PROFILE, type UserProfile, type UserProfileRole } from '../../types/user';
import styles from './UserProfileBadge.module.css';

export interface UserProfileBadgeProps {
  profile?: UserProfile;
  onRoleChange?: (newRole: UserProfileRole) => void;
  //INI SPEC-005 - 03
  // Propiedades opcionales para control y conmutación de tema
  theme?: AppTheme;
  onThemeChange?: (newTheme: AppTheme) => void;
  //FIN SPEC-005 - 03
}

export const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({
  profile = DEFAULT_USER_PROFILE,
  onRoleChange,
  //INI SPEC-005 - 03
  theme,
  onThemeChange,
  //FIN SPEC-005 - 03
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  const availableRoles: UserProfileRole[] = profile.availableRoles ?? ['Personal', 'Trabajo'];

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleRoleSelect = (role: UserProfileRole) => {
    onRoleChange?.(role);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  //INI SPEC-005 - 03
  // Conmutador accesible de tema visual
  const handleThemeSelect = (newTheme: AppTheme) => {
    onThemeChange?.(newTheme);
    setIsOpen(false);
    triggerRef.current?.focus();
  };
  //FIN SPEC-005 - 03

  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  return (
    <div ref={containerRef} className={styles.container}>
      <button
        ref={triggerRef}
        type="button"
        className={styles.trigger}
        aria-haspopup="menu"
        aria-expanded={isOpen}
        aria-label="Perfil de usuario y conmutador de rol"
        onClick={handleToggle}
      >
        <span className={styles.avatar} aria-hidden="true">
          {profile.initials}
        </span>
        <span className={styles.userInfo}>
          <span className={styles.userName}>{profile.name}</span>
          <span className={styles.roleBadge}>{profile.activeRole}</span>
        </span>
        {isOpen ? (
          <ChevronUp size={14} className={styles.chevron} aria-hidden="true" />
        ) : (
          <ChevronDown size={14} className={styles.chevron} aria-hidden="true" />
        )}
      </button>

      {isOpen && (
        <div
          className={styles.menu}
          role="menu"
          //INI SPEC-005 - 03
          // Menú accesible ampliado con rol de usuario y preferencias de apariencia
          aria-label="Menú de perfil y preferencias"
          //FIN SPEC-005 - 03
        >
          <div className={styles.menuHeader}>
            <span className={styles.menuTitle}>Contexto de calendario</span>
          </div>
          <div className={styles.menuItems}>
            {availableRoles.map((role) => {
              const isChecked = profile.activeRole === role;
              return (
                <button
                  key={role}
                  type="button"
                  role="menuitemradio"
                  aria-checked={isChecked}
                  tabIndex={0}
                  className={`${styles.menuItem} ${isChecked ? styles.menuItemActive : ''}`}
                  onClick={() => handleRoleSelect(role)}
                >
                  <span className={styles.roleLabel}>{role}</span>
                  {isChecked && (
                    <Check size={14} className={styles.checkIcon} aria-hidden="true" />
                  )}
                </button>
              );
            })}
          </div>

          {/* INI SPEC-005 - 03 */}
          {/* Subsección de apariencia accesible con conmutador claro/oscuro */}
          <div className={styles.menuDivider} role="separator" />

          <div className={styles.menuHeader}>
            <span className={styles.menuTitle}>Apariencia</span>
          </div>
          <div className={styles.menuItems}>
            <button
              type="button"
              role="menuitemradio"
              aria-checked={theme === 'light'}
              tabIndex={0}
              className={`${styles.menuItem} ${theme === 'light' ? styles.menuItemActive : ''}`}
              onClick={() => handleThemeSelect('light')}
            >
              <div className={styles.itemWithIcon}>
                <Sun size={15} className={styles.themeIcon} aria-hidden="true" />
                <span className={styles.roleLabel}>Modo Claro</span>
              </div>
              {theme === 'light' && (
                <Check size={14} className={styles.checkIcon} aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              role="menuitemradio"
              aria-checked={theme === 'dark' || !theme}
              tabIndex={0}
              className={`${styles.menuItem} ${theme === 'dark' || !theme ? styles.menuItemActive : ''}`}
              onClick={() => handleThemeSelect('dark')}
            >
              <div className={styles.itemWithIcon}>
                <Moon size={15} className={styles.themeIcon} aria-hidden="true" />
                <span className={styles.roleLabel}>Modo Oscuro</span>
              </div>
              {(theme === 'dark' || !theme) && (
                <Check size={14} className={styles.checkIcon} aria-hidden="true" />
              )}
            </button>
          </div>
          {/* FIN SPEC-005 - 03 */}
        </div>
      )}
    </div>
  );
};
//FIN SPEC-004 - 02

//INI SPEC-004 - 02
// Componente accesible UserProfileBadge con avatar, nombre, rol activo y menú conmutador
import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, ChevronUp, Check } from 'lucide-react';
import { DEFAULT_USER_PROFILE, type UserProfile, type UserProfileRole } from '../../types/user';
import styles from './UserProfileBadge.module.css';

export interface UserProfileBadgeProps {
  profile?: UserProfile;
  onRoleChange?: (newRole: UserProfileRole) => void;
}

export const UserProfileBadge: React.FC<UserProfileBadgeProps> = ({
  profile = DEFAULT_USER_PROFILE,
  onRoleChange,
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
          aria-label="Cambiar rol de usuario"
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
        </div>
      )}
    </div>
  );
};
//FIN SPEC-004 - 02

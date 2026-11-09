//INI SPEC-004 - 01
// Definición de tipos y valores por defecto para el perfil de usuario y conmutador de contexto
export type UserProfileRole = 'Personal' | 'Trabajo';

export interface UserProfile {
  id: string;
  name: string;
  initials: string;
  activeRole: UserProfileRole;
  availableRoles: UserProfileRole[];
}

export const USER_PROFILE_STORAGE_KEY = 'calendar-user-profile';

export const DEFAULT_USER_PROFILE: UserProfile = {
  id: 'usr-1',
  name: 'Usuario Demo',
  initials: 'UD',
  activeRole: 'Personal',
  availableRoles: ['Personal', 'Trabajo'],
};
//FIN SPEC-004 - 01

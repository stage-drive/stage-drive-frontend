import type { UserRole } from '@/store/api/types';

export const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  OWNER: '/owner/dashboard',
  ADMIN: '/admin/dashboard',
  TEACHER: '/teacher/dashboard',
  INSTRUCTOR: '/instructor/dashboard',
  STUDENT: '/student/dashboard',
};

export const normalizeUserRole = (role?: UserRole | string): UserRole | null => {
  if (!role) {
    return null;
  }

  const normalizedRole = role.toUpperCase() as UserRole;
  return Object.prototype.hasOwnProperty.call(ROLE_HOME_ROUTES, normalizedRole)
    ? normalizedRole
    : null;
};

export const homeRouteForRole = (role?: UserRole | string) => {
  const normalizedRole = normalizeUserRole(role);
  return normalizedRole ? ROLE_HOME_ROUTES[normalizedRole] : '/login';
};

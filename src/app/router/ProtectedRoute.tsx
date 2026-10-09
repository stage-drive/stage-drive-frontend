import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '../../store/api/endpoints/authApi';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  userRole?: UserRole | string;
}

const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  OWNER: '/owner/dashboard',
  ADMIN: '/admin/dashboard',
  TEACHER: '/teacher/dashboard',
  INSTRUCTOR: '/instructor/dashboard',
  STUDENT: '/student/dashboard',
};

const normalizeUserRole = (role?: UserRole | string): UserRole | null => {
  if (!role) {
    return null;
  }

  const normalizedRole = role.toUpperCase() as UserRole;
  return Object.prototype.hasOwnProperty.call(ROLE_HOME_ROUTES, normalizedRole)
    ? normalizedRole
    : null;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, userRole }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  const normalizedUserRole = normalizeUserRole(userRole);

  if (!normalizedUserRole) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowedRoles = allowedRoles
      .map((role) => normalizeUserRole(role))
      .filter(Boolean);

    if (!normalizedAllowedRoles.includes(normalizedUserRole)) {
      const defaultRoute = ROLE_HOME_ROUTES[normalizedUserRole] || '/login';
      return <Navigate to={defaultRoute} replace />;
    }
  }

  return <Outlet />;
};

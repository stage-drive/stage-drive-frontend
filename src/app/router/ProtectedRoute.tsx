import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '@/store/api/types';
import { homeRouteForRole, normalizeUserRole } from '@/app/router/roleHome';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  userRole?: UserRole | string;
}

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
      return <Navigate to={homeRouteForRole(normalizedUserRole)} replace />;
    }
  }

  return <Outlet />;
};

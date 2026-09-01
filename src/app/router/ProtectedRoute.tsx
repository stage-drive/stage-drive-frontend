import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import type { UserRole } from '../../store/api/endpoints/authApi';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
  userRole?: UserRole;
}

const ROLE_HOME_ROUTES: Record<UserRole, string> = {
  OWNER: '/owner/dashboard',
  ADMIN: '/admin/dashboard',
  TEACHER: '/teacher/groups',
  INSTRUCTOR: '/instructor/schedule',
  STUDENT: '/student/progress',
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, userRole }) => {
  const token = localStorage.getItem('token');

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  if (!userRole) {
    return null;
  }

  if (allowedRoles && allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    const defaultRoute = ROLE_HOME_ROUTES[userRole] || '/login';
    return <Navigate to={defaultRoute} replace />;
  }

  return <Outlet />;
};

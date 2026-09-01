import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { ProtectedRoute } from './ProtectedRoute';
import { useGetMeQuery } from '../../store/api/endpoints/authApi';

import { RegisterPage } from '../../modules/auth/pages/RegisterPage';
import { LoginPage } from '../../modules/auth/pages/LoginPage';
import { OwnerDashboardPage } from '../../modules/dashboard/pages/OwnerDashboardPage';

import { OwnerLayout } from '../../layouts/OwnerLayout/OwnerLayout';
import { AdminLayout } from '../../layouts/AdminLayout/AdminLayout';
import { TeacherLayout } from '../../layouts/TeacherLayout/TeacherLayout';
import { InstructorLayout } from '../../layouts/InstructorLayout/InstructorLayout';
import { StudentLayout } from '../../layouts/StudentLayout/StudentLayout';

const HomeRedirect: React.FC<{ userRole?: string }> = ({ userRole }) => {
  if (!userRole) return <Navigate to="/login" replace />;

  const ROLE_HOME_ROUTES: Record<string, string> = {
    OWNER: '/owner/dashboard',
    ADMIN: '/admin/dashboard',
    TEACHER: '/teacher/groups',
    INSTRUCTOR: '/instructor/schedule',
    STUDENT: '/student/progress',
  };

  return <Navigate to={ROLE_HOME_ROUTES[userRole] || '/login'} replace />;
};

export const AppRoutes: React.FC = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('auth-change', syncToken);
    return () => window.removeEventListener('auth-change', syncToken);
  }, []);

  const {
    data: user,
    isLoading,
    isFetching,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });

  if (isError && token) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
  }

  if (token && !user && (isLoading || isFetching)) {
    return (
      <div
        style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
      >
        <Spin size="large" description="Завантаження..." />
      </div>
    );
  }

  const userRole = user?.role;
  return (
    <Routes>
      {/* 1. Публічні маршрути */}
      <Route
        path="/login"
        element={token && userRole ? <Navigate to="/" replace /> : <LoginPage />}
      />
      <Route
        path="/register"
        element={token && userRole ? <Navigate to="/" replace /> : <RegisterPage />}
      />

      {/* 2. Кореневий маршрут "/" */}
      <Route path="/" element={<HomeRedirect userRole={userRole} />} />

      {/* 3. Маршрути ВЛАСНИКА (OWNER) */}
      <Route element={<ProtectedRoute allowedRoles={['OWNER']} userRole={userRole} />}>
        <Route element={<OwnerLayout />}>
          <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/admins" element={<div>Управління адміністраторами</div>} />
          <Route path="/branches" element={<div>Філії та статистика</div>} />
          <Route path="/notifications" element={<div>Сповіщення</div>} />
          <Route path="/profile" element={<div>Профіль власника</div>} />
          <Route path="/school-settings" element={<div>Налаштування автошколи</div>} />
        </Route>
      </Route>

      {/* 4. Маршрути АДМІНІСТРАТОРА (ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} userRole={userRole} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<div>Дашборд адміна</div>} />
          <Route path="/users" element={<div>Користувачі</div>} />
          <Route path="/students" element={<div>Студенти</div>} />
        </Route>
      </Route>

      {/* 5. Маршрути ВИКЛАДАЧА (TEACHER) */}
      <Route element={<ProtectedRoute allowedRoles={['TEACHER']} userRole={userRole} />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/dashboard" element={<div>Дашборд викладача</div>} />
        </Route>
      </Route>

      {/* 6. Маршрути ІНСТРУКТОРА (INSTRUCTOR) */}
      <Route element={<ProtectedRoute allowedRoles={['INSTRUCTOR']} userRole={userRole} />}>
        <Route element={<InstructorLayout />}>
          <Route path="/instructor/dashboard" element={<div>Дашборд інструктора</div>} />
        </Route>
      </Route>

      {/* 7. Маршрути СТУДЕНТА (STUDENT) */}
      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} userRole={userRole} />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<div>Дашборд студента</div>} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>Сторінку не знайдено (404)</div>} />
    </Routes>
  );
};

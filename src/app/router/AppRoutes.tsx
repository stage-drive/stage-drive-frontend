import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import { ProtectedRoute } from './ProtectedRoute';
import { useGetMeQuery } from '../../store/api/endpoints/authApi';

import { RegisterPage } from '../../modules/auth/pages/RegisterPage';
import { LoginPage } from '../../modules/auth/pages/LoginPage';
import { ForgotPasswordPage } from '../../modules/auth/pages/ForgotPasswordPage';
import { ResetPasswordPage } from '../../modules/auth/pages/ResetPasswordPage';
import { AcceptInvitationPage } from '../../modules/auth/pages/AcceptInvitationPage';
import { OwnerDashboardPage } from '../../modules/dashboard/pages/OwnerDashboardPage';
import { AdminOverviewDashboardPage } from '../../modules/dashboard/pages/AdminOverviewDashboardPage';
import { TeacherDashboardPage } from '../../modules/dashboard/pages/TeacherDashboardPage';
import { InstructorDashboardPage } from '../../modules/dashboard/pages/InstructorDashboardPage';
import { StudentDashboardPage } from '../../modules/dashboard/pages/StudentDashboardPage';

import { OwnerLayout } from '../../layouts/OwnerLayout/OwnerLayout';
import { AdminLayout } from '../../layouts/AdminLayout/AdminLayout';
import { TeacherLayout } from '../../layouts/TeacherLayout/TeacherLayout';
import { InstructorLayout } from '../../layouts/InstructorLayout/InstructorLayout';
import { StudentLayout } from '../../layouts/StudentLayout/StudentLayout';
import { AdminDashboardPage } from '@/modules/dashboard/pages/AdminDashboardPage.tsx';
import { InviteMemberPage } from '@/modules/users/pages/InviteMemberPage.tsx';
import { ProfilePage } from '@/modules/profile/pages/ProfilePage';
import { StudentsPage } from '@/modules/students/pages/StudentsPage';
import { StudentPageStub } from '@/modules/student/pages/StudentPages';

const HomeRedirect: React.FC<{ userRole?: string }> = ({ userRole }) => {
  if (!userRole) return <Navigate to="/login" replace />;

  const ROLE_HOME_ROUTES: Record<string, string> = {
    OWNER: '/owner/dashboard',
    ADMIN: '/admin/dashboard',
    TEACHER: '/teacher/dashboard',
    INSTRUCTOR: '/instructor/dashboard',
    STUDENT: '/student/dashboard',
  };

  const normalizedRole = userRole.toUpperCase();
  return <Navigate to={ROLE_HOME_ROUTES[normalizedRole] || '/login'} replace />;
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
      <Route
        path="/forgot-password"
        element={token && userRole ? <Navigate to="/" replace /> : <ForgotPasswordPage />}
      />
      <Route
        path="/reset-password"
        element={token && userRole ? <Navigate to="/" replace /> : <ResetPasswordPage />}
      />
      <Route path="/invite" element={<AcceptInvitationPage />} />
      <Route path="/accept-invitation" element={<AcceptInvitationPage />} />

      {/* 2. Кореневий маршрут "/" */}
      <Route path="/" element={<HomeRedirect userRole={userRole} />} />

      {/* 3. Маршрути ВЛАСНИКА (OWNER) */}
      <Route element={<ProtectedRoute allowedRoles={['OWNER']} userRole={userRole} />}>
        <Route element={<OwnerLayout />}>
          <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/owner/admins" element={<AdminDashboardPage />} />
          <Route path="/owner/branches" element={<div>Філії та статистика</div>} />
          <Route path="/owner/notifications" element={<div>Сповіщення</div>} />
          <Route path="/owner/profile" element={<ProfilePage />} />
          <Route path="/owner/school-settings" element={<div>Налаштування автошколи</div>} />
        </Route>
      </Route>

      {/* 4. Маршрути АДМІНІСТРАТОРА (ADMIN) */}
      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} userRole={userRole} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminOverviewDashboardPage />} />
          <Route path="/admin/users" element={<InviteMemberPage />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/groups" element={<div>Навчальні групи</div>} />
          <Route path="/admin/cars" element={<div>Автопарк</div>} />
          <Route path="/admin/schedule" element={<div>Розклад</div>} />
          <Route path="/admin/theory" element={<div>Теоретичний курс</div>} />
          <Route path="/admin/practice" element={<div>Практичні заняття</div>} />
          <Route path="/admin/topics" element={<div>Теми</div>} />
          <Route path="/admin/payments" element={<div>Оплата</div>} />
          <Route path="/admin/notifications" element={<div>Сповіщення адміністратора</div>} />
          <Route path="/admin/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* 5. Маршрути ВИКЛАДАЧА (TEACHER) */}
      <Route element={<ProtectedRoute allowedRoles={['TEACHER']} userRole={userRole} />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
          <Route path="/teacher/profile" element={<ProfilePage />} />
          <Route path="/teacher/my-groups" element={<StudentPageStub title="Мої групи" />} />
          <Route path="/teacher/my-students" element={<StudentPageStub title="Мої студенти" />} />
          <Route path="/teacher/theory" element={<StudentPageStub title="Теоретичний курс" />} />
          <Route path="/teacher/tests" element={<StudentPageStub title="Тести" />} />
          <Route path="/teacher/attendance" element={<StudentPageStub title="Відвідуваність" />} />
          <Route path="/teacher/notifications" element={<StudentPageStub title="Сповіщення" />} />
        </Route>
      </Route>

      {/* 6. Маршрути ІНСТРУКТОРА (INSTRUCTOR) */}
      <Route element={<ProtectedRoute allowedRoles={['INSTRUCTOR']} userRole={userRole} />}>
        <Route element={<InstructorLayout />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
          <Route path="/instructor/profile" element={<ProfilePage />} />
          <Route path="/instructor/schedule" element={<StudentPageStub title="Мій розклад" />} />
          <Route
            path="/instructor/my-car"
            element={<StudentPageStub title="Практичні заняття" />}
          />
          <Route
            path="/instructor/my-students"
            element={<StudentPageStub title="Мої студенти" />}
          />
          <Route
            path="/instructor/notifications"
            element={<StudentPageStub title="Сповіщення" />}
          />
        </Route>
      </Route>

      {/* 7. Маршрути СТУДЕНТА (STUDENT) */}
      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} userRole={userRole} />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/student/schedule" element={<StudentPageStub title="Мій розклад" />} />
          <Route path="/student/theory" element={<StudentPageStub title="Теоретичний курс" />} />
          <Route path="/student/tests" element={<StudentPageStub title="Тести" />} />
          <Route path="/student/practice" element={<StudentPageStub title="Практичні заняття" />} />
          <Route path="/student/progress" element={<StudentPageStub title="Мій прогрес" />} />
          <Route path="/student/payments" element={<StudentPageStub title="Оплати" />} />
          <Route path="/student/notifications" element={<StudentPageStub title="Сповіщення" />} />
        </Route>
      </Route>

      {/* 404 */}
      <Route path="*" element={<div>Сторінку не знайдено (404)</div>} />
    </Routes>
  );
};

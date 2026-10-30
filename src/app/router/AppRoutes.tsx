import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { Flex, Result, Spin } from 'antd';
import { AdminLayout } from '@/layouts/AdminLayout';
import { InstructorLayout } from '@/layouts/InstructorLayout';
import { OwnerLayout } from '@/layouts/OwnerLayout';
import { StudentLayout } from '@/layouts/StudentLayout';
import { TeacherLayout } from '@/layouts/TeacherLayout';
import { AcceptInvitationPage } from '@/modules/auth/pages/AcceptInvitationPage';
import { ForgotPasswordPage } from '@/modules/auth/pages/ForgotPasswordPage';
import { LoginPage } from '@/modules/auth/pages/LoginPage';
import { RegisterPage } from '@/modules/auth/pages/RegisterPage';
import { ResetPasswordPage } from '@/modules/auth/pages/ResetPasswordPage';
import { AdminDashboardPage } from '@/modules/dashboard/pages/AdminDashboardPage';
import { InstructorDashboardPage } from '@/modules/dashboard/pages/InstructorDashboardPage';
import { OwnerDashboardPage } from '@/modules/dashboard/pages/OwnerDashboardPage';
import { StudentDashboardPage } from '@/modules/dashboard/pages/StudentDashboardPage';
import { TeacherDashboardPage } from '@/modules/dashboard/pages/TeacherDashboardPage';
import { ProfilePage } from '@/modules/profile/pages/ProfilePage';
import { SchoolSettingsPage } from '@/modules/organization/pages/SchoolSettingsPage';
import { StudentCardPage } from '@/modules/students/pages/StudentCardPage';
import { StudentsPage } from '@/modules/students/pages/StudentsPage';
import { InviteAdminPage } from '@/modules/invitations/pages/InviteAdminPage';
import { InviteMemberPage } from '@/modules/invitations/pages/InviteMemberPage';
import { PlaceholderPage } from '@/shared/components/PlaceholderPage';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';
import { homeRouteForRole } from '@/app/router/roleHome';
import { useAuthSession } from '@/app/router/useAuthSession';

const guestOnly = (token: string | null, userRole: string | undefined, page: ReactNode) =>
  token && userRole ? <Navigate to="/" replace /> : page;

export const AppRoutes = () => {
  const { token, userRole, isBootstrapping } = useAuthSession();

  if (isBootstrapping) {
    return (
      <Flex align="center" justify="center" style={{ height: '100vh' }}>
        <Spin size="large" description="Завантаження..." />
      </Flex>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={guestOnly(token, userRole, <LoginPage />)} />
      <Route path="/register" element={guestOnly(token, userRole, <RegisterPage />)} />
      <Route
        path="/forgot-password"
        element={guestOnly(token, userRole, <ForgotPasswordPage />)}
      />
      <Route path="/reset-password" element={guestOnly(token, userRole, <ResetPasswordPage />)} />
      <Route path="/invite" element={<AcceptInvitationPage />} />
      <Route path="/accept-invitation" element={<AcceptInvitationPage />} />
      <Route path="/" element={<Navigate to={homeRouteForRole(userRole)} replace />} />

      <Route element={<ProtectedRoute allowedRoles={['OWNER']} userRole={userRole} />}>
        <Route element={<OwnerLayout />}>
          <Route path="/owner/dashboard" element={<OwnerDashboardPage />} />
          <Route path="/owner/admins" element={<InviteAdminPage />} />
          <Route path="/owner/branches" element={<PlaceholderPage title="Філії та статистика" />} />
          <Route path="/owner/notifications" element={<PlaceholderPage title="Сповіщення" />} />
          <Route path="/owner/profile" element={<ProfilePage />} />
          <Route path="/owner/school-settings" element={<SchoolSettingsPage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['ADMIN']} userRole={userRole} />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          <Route path="/admin/users" element={<InviteMemberPage />} />
          <Route path="/admin/students" element={<StudentsPage />} />
          <Route path="/admin/students/:id" element={<StudentCardPage />} />
          <Route path="/admin/groups" element={<PlaceholderPage title="Навчальні групи" />} />
          <Route path="/admin/cars" element={<PlaceholderPage title="Автопарк" />} />
          <Route path="/admin/schedule" element={<PlaceholderPage title="Розклад" />} />
          <Route path="/admin/theory" element={<PlaceholderPage title="Теоретичний курс" />} />
          <Route path="/admin/practice" element={<PlaceholderPage title="Практичні заняття" />} />
          <Route path="/admin/topics" element={<PlaceholderPage title="Теми" />} />
          <Route path="/admin/payments" element={<PlaceholderPage title="Оплата" />} />
          <Route
            path="/admin/notifications"
            element={<PlaceholderPage title="Сповіщення адміністратора" />}
          />
          <Route path="/admin/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['TEACHER']} userRole={userRole} />}>
        <Route element={<TeacherLayout />}>
          <Route path="/teacher/dashboard" element={<TeacherDashboardPage />} />
          <Route path="/teacher/profile" element={<ProfilePage />} />
          <Route path="/teacher/my-groups" element={<PlaceholderPage title="Мої групи" />} />
          <Route path="/teacher/my-students" element={<PlaceholderPage title="Мої студенти" />} />
          <Route path="/teacher/theory" element={<PlaceholderPage title="Теоретичний курс" />} />
          <Route path="/teacher/tests" element={<PlaceholderPage title="Тести" />} />
          <Route path="/teacher/attendance" element={<PlaceholderPage title="Відвідуваність" />} />
          <Route path="/teacher/notifications" element={<PlaceholderPage title="Сповіщення" />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['INSTRUCTOR']} userRole={userRole} />}>
        <Route element={<InstructorLayout />}>
          <Route path="/instructor/dashboard" element={<InstructorDashboardPage />} />
          <Route path="/instructor/profile" element={<ProfilePage />} />
          <Route path="/instructor/schedule" element={<PlaceholderPage title="Мій розклад" />} />
          <Route
            path="/instructor/practice"
            element={<PlaceholderPage title="Практичні заняття" />}
          />
          <Route
            path="/instructor/my-students"
            element={<PlaceholderPage title="Мої студенти" />}
          />
          <Route
            path="/instructor/notifications"
            element={<PlaceholderPage title="Сповіщення" />}
          />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={['STUDENT']} userRole={userRole} />}>
        <Route element={<StudentLayout />}>
          <Route path="/student/dashboard" element={<StudentDashboardPage />} />
          <Route path="/student/profile" element={<ProfilePage />} />
          <Route path="/student/schedule" element={<PlaceholderPage title="Мій розклад" />} />
          <Route path="/student/theory" element={<PlaceholderPage title="Теоретичний курс" />} />
          <Route path="/student/tests" element={<PlaceholderPage title="Тести" />} />
          <Route path="/student/practice" element={<PlaceholderPage title="Практичні заняття" />} />
          <Route path="/student/progress" element={<PlaceholderPage title="Мій прогрес" />} />
          <Route path="/student/payments" element={<PlaceholderPage title="Оплати" />} />
          <Route path="/student/notifications" element={<PlaceholderPage title="Сповіщення" />} />
        </Route>
      </Route>

      <Route
        path="*"
        element={<Result status="404" title="404" subTitle="Сторінку не знайдено" />}
      />
    </Routes>
  );
};

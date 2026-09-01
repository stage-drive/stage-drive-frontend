import { Routes, Route } from 'react-router-dom';
import { renderWithProviders, screen } from '../../test-utils';
import { ProtectedRoute } from '@/app/router/ProtectedRoute';

function renderProtectedRoute({
  route,
  allowedRoles,
  userRole,
}: {
  route: string;
  allowedRoles?: Array<'OWNER' | 'ADMIN' | 'TEACHER' | 'INSTRUCTOR' | 'STUDENT'>;
  userRole?: 'OWNER' | 'ADMIN' | 'TEACHER' | 'INSTRUCTOR' | 'STUDENT';
}) {
  return renderWithProviders(
    <Routes>
      <Route element={<ProtectedRoute allowedRoles={allowedRoles} userRole={userRole} />}>
        <Route path={route} element={<div>Protected content</div>} />
      </Route>
      <Route path="/login" element={<div>Login page</div>} />
      <Route path="/owner/dashboard" element={<div>Owner home</div>} />
      <Route path="/admin/dashboard" element={<div>Admin home</div>} />
    </Routes>,
    { route }
  );
}

describe('ProtectedRoute', () => {
  it('redirects to login when there is no token', () => {
    renderProtectedRoute({
      route: '/owner/dashboard',
      allowedRoles: ['OWNER'],
      userRole: 'OWNER',
    });

    expect(screen.getByText('Login page')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });

  it('renders nothing while the user role is unknown', () => {
    localStorage.setItem('token', 'test-token');

    renderProtectedRoute({
      route: '/owner/dashboard',
      allowedRoles: ['OWNER'],
    });

    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
    expect(screen.queryByText('Login page')).not.toBeInTheDocument();
  });

  it('renders the outlet when the role is allowed', () => {
    localStorage.setItem('token', 'test-token');

    renderProtectedRoute({
      route: '/owner/dashboard',
      allowedRoles: ['OWNER'],
      userRole: 'OWNER',
    });

    expect(screen.getByText('Protected content')).toBeInTheDocument();
  });

  it('redirects to the role home when access is forbidden', () => {
    localStorage.setItem('token', 'test-token');

    renderProtectedRoute({
      route: '/admin/dashboard',
      allowedRoles: ['ADMIN'],
      userRole: 'OWNER',
    });

    expect(screen.getByText('Owner home')).toBeInTheDocument();
    expect(screen.queryByText('Protected content')).not.toBeInTheDocument();
  });
});

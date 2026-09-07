import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import { LoginForm } from '@/modules/auth/components/LoginForm';

const { mockLogin, mockNavigate } = vi.hoisted(() => ({
  mockLogin: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/store/api/endpoints/authApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/api/endpoints/authApi')>();
  return {
    ...actual,
    useLoginMutation: () => [mockLogin, { isLoading: false }],
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('LoginForm', () => {
  beforeEach(() => {
    mockLogin.mockReset();
    mockNavigate.mockReset();
  });

  it('renders email, password and actions', () => {
    renderWithProviders(<LoginForm />);

    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Пароль')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /^Увійти$/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Увійти через Google/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Забули пароль?' })).toHaveAttribute(
      'href',
      '/forgot-password'
    );
  });

  it('shows validation errors when submitted empty', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole('button', { name: /^Увійти$/ }));

    expect(await screen.findByText('Введіть email')).toBeInTheDocument();
    expect(screen.getByText('Введіть пароль')).toBeInTheDocument();
    expect(mockLogin).not.toHaveBeenCalled();
  });

  it('stores tokens and navigates after a successful login', async () => {
    const user = userEvent.setup();
    mockLogin.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          user: { id: '1', role: 'OWNER' },
        }),
    });

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'owner@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'password123');
    await user.click(screen.getByRole('button', { name: /^Увійти$/ }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith({
        email: 'owner@example.com',
        password: 'password123',
      });
    });

    expect(localStorage.getItem('token')).toBe('access-token');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });

  it('shows an error message when credentials are invalid', async () => {
    const user = userEvent.setup();
    mockLogin.mockReturnValue({
      unwrap: () =>
        Promise.reject({
          data: { message: 'Invalid credentials' },
        }),
    });

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText('Email'), 'owner@example.com');
    await user.type(screen.getByLabelText('Пароль'), 'wrong-password');
    await user.click(screen.getByRole('button', { name: /^Увійти$/ }));

    expect(await screen.findByText('Невірний email або пароль')).toBeInTheDocument();
    expect(localStorage.getItem('token')).toBeNull();
    expect(mockNavigate).not.toHaveBeenCalled();
  });

  it('redirects to Google auth', async () => {
    const user = userEvent.setup();
    const location = { href: 'http://localhost:3000/' };
    vi.stubGlobal('location', location);

    renderWithProviders(<LoginForm />);
    await user.click(screen.getByRole('button', { name: /Увійти через Google/ }));

    expect(location.href).toMatch(/\/auth\/google$/);
  });
});

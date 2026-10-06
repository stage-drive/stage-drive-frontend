import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { fireEvent, renderWithProviders, screen, waitFor } from '../../../test-utils';
import { ForgotPasswordPage } from '@/modules/auth/pages/ForgotPasswordPage';

const { mockForgotPassword, mockNavigate } = vi.hoisted(() => ({
  mockForgotPassword: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/store/api/endpoints/authApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/api/endpoints/authApi')>();
  return {
    ...actual,
    useForgotPasswordMutation: () => [mockForgotPassword, { isLoading: false }],
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ForgotPasswordPage', () => {
  beforeEach(() => {
    mockForgotPassword.mockReset();
    mockNavigate.mockReset();
  });

  it('renders the email recovery form and login link', () => {
    renderWithProviders(<ForgotPasswordPage />);

    expect(screen.getByRole('heading', { name: 'Забули пароль?' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Надіслати посилання' })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /Повернутися до входу/ })).toHaveAttribute(
      'href',
      '/login'
    );
  });

  it('requires a valid email before sending the request', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ForgotPasswordPage />);

    await user.click(screen.getByRole('button', { name: 'Надіслати посилання' }));
    expect(await screen.findByText('Введіть email')).toBeInTheDocument();
    expect(mockForgotPassword).not.toHaveBeenCalled();

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'not-an-email' } });
    await user.click(screen.getByRole('button', { name: 'Надіслати посилання' }));
    expect(await screen.findByText('Введіть коректний email')).toBeInTheDocument();
    expect(mockForgotPassword).not.toHaveBeenCalled();
  });

  it('submits the email and shows the confirmation state', async () => {
    const user = userEvent.setup();
    mockForgotPassword.mockReturnValue({ unwrap: () => Promise.resolve() });
    renderWithProviders(<ForgotPasswordPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'owner@example.com' } });
    await user.click(screen.getByRole('button', { name: 'Надіслати посилання' }));

    await waitFor(() => {
      expect(mockForgotPassword).toHaveBeenCalledWith({ email: 'owner@example.com' });
    });
    expect(await screen.findByText('Перевірте пошту')).toBeInTheDocument();
    expect(screen.getByText(/owner@example\.com/)).toBeInTheDocument();
  }, 10000);

  it('shows an API error when the request fails', async () => {
    const user = userEvent.setup();
    mockForgotPassword.mockReturnValue({
      unwrap: () => Promise.reject({ data: { message: 'Сервіс тимчасово недоступний' } }),
    });
    renderWithProviders(<ForgotPasswordPage />);

    fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'owner@example.com' } });
    await user.click(screen.getByRole('button', { name: 'Надіслати посилання' }));

    expect(await screen.findByText('Сервіс тимчасово недоступний')).toBeInTheDocument();
    expect(screen.queryByText('Перевірте пошту')).not.toBeInTheDocument();
  }, 10000);
});

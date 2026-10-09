import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import { ResetPasswordPage } from '@/modules/auth/pages/ResetPasswordPage';

const { mockResetPassword, mockNavigate } = vi.hoisted(() => ({
  mockResetPassword: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/store/api/endpoints/authApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/api/endpoints/authApi')>();
  return {
    ...actual,
    useResetPasswordMutation: () => [mockResetPassword, { isLoading: false }],
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useSearchParams: () => [new URLSearchParams('token=test-token')],
  };
});

describe('ResetPasswordPage', () => {
  beforeEach(() => {
    mockResetPassword.mockReset();
    mockResetPassword.mockImplementation(() => ({
      unwrap: () => Promise.resolve({ success: true }),
    }));
    mockNavigate.mockReset();
  });

  it('renders the reset password form and allows password visibility toggle', async () => {
    const user = userEvent.setup();

    renderWithProviders(<ResetPasswordPage />);

    const passwordInput = screen.getByPlaceholderText('Введіть новий пароль');
    const confirmInput = screen.getByPlaceholderText('Повторіть новий пароль');

    expect(passwordInput).toHaveAttribute('type', 'password');
    expect(confirmInput).toHaveAttribute('type', 'password');

    await user.click(screen.getAllByRole('button', { name: 'Показати пароль' })[0]);

    expect(passwordInput).toHaveAttribute('type', 'text');
    expect(screen.getAllByRole('button', { name: 'Приховати пароль' }).length).toBeGreaterThan(0);
  });

  it('submits the new password and calls the reset API', async () => {
    const user = userEvent.setup();
    const validPassword = 'NewPassword123!';

    renderWithProviders(<ResetPasswordPage />);

    await user.type(screen.getByPlaceholderText('Введіть новий пароль'), validPassword);
    await user.type(screen.getByPlaceholderText('Повторіть новий пароль'), validPassword);
    
    await user.click(screen.getByRole('button', { name: 'Змінити пароль' }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith({
        token: 'test-token',
        password: validPassword,
        passwordConfirmation: validPassword,
      });
    });
  });
});
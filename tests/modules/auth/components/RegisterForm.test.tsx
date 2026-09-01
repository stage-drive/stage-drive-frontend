import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';

const { mockRegister, mockNavigate } = vi.hoisted(() => ({
  mockRegister: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/store/api/endpoints/authApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/api/endpoints/authApi')>();
  return {
    ...actual,
    useRegisterMutation: () => [mockRegister, { isLoading: false }],
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

async function fillRequiredFields(
  user: ReturnType<typeof userEvent.setup>,
  overrides: { password?: string; confirmation?: string } = {}
) {
  await user.type(screen.getByLabelText('Назва автошколи'), 'Автошкола Драйв');
  await user.type(screen.getByLabelText("Ім'я"), 'Олександр');
  await user.type(screen.getByLabelText('Прізвище'), 'Шевченко');
  await user.type(screen.getByLabelText('Email'), 'owner@example.com');
  await user.type(screen.getByLabelText('Пароль'), overrides.password ?? 'password123');
  await user.type(
    screen.getByLabelText('Підтвердження пароля'),
    overrides.confirmation ?? 'password123'
  );
  await user.click(screen.getByRole('checkbox'));
}

describe('RegisterForm', () => {
  beforeEach(() => {
    mockRegister.mockReset();
    mockNavigate.mockReset();
  });

  it('renders the registration form', () => {
    renderWithProviders(<RegisterForm />);

    expect(screen.getByText('Реєстрація автошколи')).toBeInTheDocument();
    expect(screen.getByLabelText('Назва автошколи')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Зареєструватися' })).toBeInTheDocument();
  });

  it('shows a validation error when passwords do not match', async () => {
    const user = userEvent.setup();
    renderWithProviders(<RegisterForm />);

    await fillRequiredFields(user, {
      password: 'password123',
      confirmation: 'password456',
    });
    await user.click(screen.getByRole('button', { name: 'Зареєструватися' }));

    expect(await screen.findByText('Паролі не збігаються!')).toBeInTheDocument();
    expect(mockRegister).not.toHaveBeenCalled();
  });

  it('stores tokens and navigates after a successful registration', async () => {
    const user = userEvent.setup();
    mockRegister.mockReturnValue({
      unwrap: () =>
        Promise.resolve({
          accessToken: 'access-token',
          refreshToken: 'refresh-token',
          user: { id: '1', role: 'OWNER' },
        }),
    });

    renderWithProviders(<RegisterForm />);
    await fillRequiredFields(user);
    await user.click(screen.getByRole('button', { name: 'Зареєструватися' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });

    expect(localStorage.getItem('token')).toBe('access-token');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  });
});

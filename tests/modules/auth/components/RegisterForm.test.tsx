import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { fireEvent, renderWithProviders, screen, waitFor } from '../../../test-utils';
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
  fireEvent.change(screen.getByLabelText('Назва автошколи'), {
    target: { value: 'Автошкола Драйв' },
  });
  fireEvent.change(screen.getByLabelText("Ім'я"), { target: { value: 'Олександр' } });
  fireEvent.change(screen.getByLabelText('Прізвище'), { target: { value: 'Шевченко' } });
  fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'owner@example.com' } });
  fireEvent.change(screen.getByLabelText('Пароль'), {
    target: { value: overrides.password ?? 'ValidPass123!' },
  });
  fireEvent.change(screen.getByLabelText('Підтвердження пароля'), {
    target: { value: overrides.confirmation ?? 'ValidPass123!' },
  });
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
      password: 'ValidPass123!',
      confirmation: 'OtherPass123!',
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
    fireEvent.change(screen.getByLabelText("Номер телефону (необов'язково)"), {
      target: { value: '0501234567' },
    });
    await user.click(screen.getByRole('button', { name: 'Зареєструватися' }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalled();
    });

    expect(localStorage.getItem('token')).toBe('access-token');
    expect(localStorage.getItem('refreshToken')).toBe('refresh-token');
    expect(mockRegister).toHaveBeenCalledWith(expect.objectContaining({ phone: '+380501234567' }));
    expect(mockNavigate).toHaveBeenCalledWith('/', { replace: true });
  }, 10000);
});

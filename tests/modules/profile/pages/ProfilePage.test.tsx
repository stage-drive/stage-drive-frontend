import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { fireEvent, renderWithProviders, screen, waitFor } from '../../../test-utils';
import { ProfilePage } from '@/modules/profile/pages/ProfilePage';

const {
  mockUpdateMe,
  mockChangePassword,
  mockDeleteMe,
  mockUploadAvatar,
  mockDeleteAvatar,
  mockNavigate,
} = vi.hoisted(() => ({
  mockUpdateMe: vi.fn(),
  mockChangePassword: vi.fn(),
  mockDeleteMe: vi.fn(),
  mockUploadAvatar: vi.fn(),
  mockDeleteAvatar: vi.fn(),
  mockNavigate: vi.fn(),
}));

vi.mock('@/store/api/endpoints/authApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/api/endpoints/authApi')>();
  return {
    ...actual,
    useGetMeQuery: () => ({
      data: {
        id: 'user-1',
        email: 'user@example.com',
        firstName: 'Олена',
        lastName: 'Коваль',
        phone: '+380991234567',
        avatarUrl: null,
        role: 'ADMIN',
        status: 'ACTIVE',
        organizationId: 'school-1',
      },
      isLoading: false,
      isError: false,
    }),
    useUpdateMeMutation: () => [mockUpdateMe, { isLoading: false }],
    useChangeMyPasswordMutation: () => [mockChangePassword, { isLoading: false }],
    useDeleteMeMutation: () => [mockDeleteMe, { isLoading: false }],
    useUploadMyAvatarMutation: () => [mockUploadAvatar, { isLoading: false }],
    useDeleteMyAvatarMutation: () => [mockDeleteAvatar, { isLoading: false }],
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('ProfilePage', () => {
  beforeEach(() => {
    mockUpdateMe.mockReset().mockReturnValue({ unwrap: () => Promise.resolve({}) });
    mockChangePassword.mockReset().mockReturnValue({
      unwrap: () => Promise.resolve({ message: 'Password updated' }),
    });
    mockDeleteMe.mockReset().mockReturnValue({ unwrap: () => Promise.resolve() });
    mockUploadAvatar.mockReset().mockReturnValue({ unwrap: () => Promise.resolve({}) });
    mockDeleteAvatar.mockReset().mockReturnValue({ unwrap: () => Promise.resolve({}) });
    mockNavigate.mockReset();
  });

  it('renders the current account and editable profile fields', () => {
    renderWithProviders(<ProfilePage />);

    expect(screen.getByRole('heading', { name: 'Профіль' })).toBeInTheDocument();
    expect(screen.getByText('user@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText("Ім'я")).toHaveValue('Олена');
    expect(screen.getByLabelText('Прізвище')).toHaveValue('Коваль');
    expect(screen.getByLabelText('Телефон')).toHaveValue('+380 (99) 123-45-67');
    expect(screen.getByText(/Email змінити поки неможливо/)).toBeInTheDocument();
  });

  it('saves editable profile data using the documented payload', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);

    fireEvent.change(screen.getByLabelText("Ім'я"), { target: { value: 'Ольга' } });
    fireEvent.change(screen.getByLabelText('Телефон'), { target: { value: '' } });
    await user.click(screen.getByRole('button', { name: 'Зберегти зміни' }));

    await waitFor(() => {
      expect(mockUpdateMe).toHaveBeenCalledWith({
        firstName: 'Ольга',
        lastName: 'Коваль',
        phone: null,
      });
    });
  }, 10000);

  it('changes password without sending the confirmation-only field', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);

    fireEvent.change(screen.getByLabelText('Поточний пароль'), {
      target: { value: 'OldPassword123' },
    });
    fireEvent.change(screen.getByLabelText('Новий пароль'), {
      target: { value: 'NewPassword123!' },
    });
    fireEvent.change(screen.getByLabelText('Підтвердження нового пароля'), {
      target: { value: 'NewPassword123!' },
    });
    await user.click(screen.getByRole('button', { name: 'Змінити пароль' }));

    await waitFor(() => {
      expect(mockChangePassword).toHaveBeenCalledWith({
        currentPassword: 'OldPassword123',
        newPassword: 'NewPassword123!',
      });
    });
  }, 10000);

  it('deletes the account only after confirmation and returns to login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<ProfilePage />);

    await user.click(screen.getByRole('button', { name: /Видалити акаунт/ }));
    expect(
      await screen.findByText('Ви втратите доступ до профілю та даних акаунта.')
    ).toBeInTheDocument();
    const confirmationButtons = screen.getAllByRole('button', { name: /Видалити акаунт/ });
    fireEvent.click(confirmationButtons[confirmationButtons.length - 1]);

    await waitFor(() => {
      expect(mockDeleteMe).toHaveBeenCalled();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    expect(localStorage.getItem('token')).toBeNull();
  });
});

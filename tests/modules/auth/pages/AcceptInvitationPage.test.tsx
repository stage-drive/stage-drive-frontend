import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { fireEvent, renderWithProviders, screen, waitFor } from '../../../test-utils';
import { AcceptInvitationPage } from '@/modules/auth/pages/AcceptInvitationPage';

const { mockActivate, mockNavigate, mockVerifyQuery } = vi.hoisted(() => ({
  mockActivate: vi.fn(),
  mockNavigate: vi.fn(),
  mockVerifyQuery: vi.fn(),
}));

vi.mock('@/store/api/endpoints/invitationsApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/api/endpoints/invitationsApi')>();
  return {
    ...actual,
    useVerifyInvitationTokenQuery: mockVerifyQuery,
    useActivateAccountMutation: () => [mockActivate, { isLoading: false }],
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const verifiedInvitation = {
  data: {
    valid: true,
    email: 'teacher@example.com',
    role: 'TEACHER' as const,
    organizationName: 'Автошкола Драйв',
  },
  error: undefined,
  isLoading: false,
};

describe('AcceptInvitationPage', () => {
  beforeEach(() => {
    mockActivate.mockReset();
    mockNavigate.mockReset();
    mockVerifyQuery.mockReset();
    mockVerifyQuery.mockReturnValue(verifiedInvitation);
  });

  it('verifies the URL token and displays invitation details and password form', () => {
    renderWithProviders(<AcceptInvitationPage />, {
      route: '/invite?token=invite-token',
    });

    expect(mockVerifyQuery).toHaveBeenCalledWith({ token: 'invite-token' }, { skip: false });
    expect(screen.getByText('teacher@example.com')).toBeInTheDocument();
    expect(screen.getByLabelText('Новий пароль')).toBeInTheDocument();
    expect(screen.getByLabelText('Підтвердіть пароль')).toBeInTheDocument();
  });

  it('shows an error for an invalid invitation token', () => {
    mockVerifyQuery.mockReturnValue({
      data: undefined,
      error: { data: { message: 'Посилання-запрошення недійсне.' } },
      isLoading: false,
    });

    renderWithProviders(<AcceptInvitationPage />, { route: '/invite?token=bad-token' });

    expect(screen.getByText('Запрошення недійсне')).toBeInTheDocument();
    expect(screen.getByText('Посилання-запрошення недійсне.')).toBeInTheDocument();
  });

  it('does not activate when password confirmation does not match', async () => {
    const user = userEvent.setup();
    renderWithProviders(<AcceptInvitationPage />, {
      route: '/invite?token=invite-token',
    });

    fireEvent.change(screen.getByLabelText('Новий пароль'), {
      target: { value: 'SecurePassword123!' },
    });
    fireEvent.change(screen.getByLabelText('Підтвердіть пароль'), {
      target: { value: 'DifferentPassword123!' },
    });
    await user.click(screen.getByRole('button', { name: 'Активувати акаунт' }));

    expect(await screen.findByText('Паролі не збігаються')).toBeInTheDocument();
    expect(mockActivate).not.toHaveBeenCalled();
  }, 10000);

  it('activates with the documented payload and navigates to login', async () => {
    const user = userEvent.setup();
    mockActivate.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    renderWithProviders(<AcceptInvitationPage />, {
      route: '/invite?token=invite-token',
    });

    fireEvent.change(screen.getByLabelText('Новий пароль'), {
      target: { value: 'SecurePassword123!' },
    });
    fireEvent.change(screen.getByLabelText('Підтвердіть пароль'), {
      target: { value: 'SecurePassword123!' },
    });
    await user.click(screen.getByRole('button', { name: 'Активувати акаунт' }));

    await waitFor(() => {
      expect(mockActivate).toHaveBeenCalledWith({
        token: 'invite-token',
        password: 'SecurePassword123!',
        passwordConfirmation: 'SecurePassword123!',
      });
    });
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
  }, 10000);
});

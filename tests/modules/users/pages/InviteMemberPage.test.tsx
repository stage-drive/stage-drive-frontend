import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { renderWithProviders, screen, waitFor } from '../../../test-utils';
import { InviteMemberPage } from '@/modules/users/pages/InviteMemberPage';

const { mockSendMemberInvitation, mockGetInvitations, mockCancelInvitation, mockResendInvitation } =
  vi.hoisted(() => ({
    mockSendMemberInvitation: vi.fn(),
    mockGetInvitations: vi.fn(),
    mockCancelInvitation: vi.fn(),
    mockResendInvitation: vi.fn(),
  }));

vi.mock('@/store/api/endpoints/invitationsApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/api/endpoints/invitationsApi')>();
  return {
    ...actual,
    useSendMemberInvitationMutation: () => [mockSendMemberInvitation, { isLoading: false }],
    useCancelInvitationMutation: () => [mockCancelInvitation, { isLoading: false }],
    useResendInvitationMutation: () => [mockResendInvitation, { isLoading: false }],
    useGetInvitationsQuery: mockGetInvitations,
  };
});

describe('InviteMemberPage', () => {
  beforeEach(() => {
    mockSendMemberInvitation.mockReset();
    mockCancelInvitation.mockReset();
    mockResendInvitation.mockReset();
    mockGetInvitations.mockReset();
    mockGetInvitations.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });
  });

 it('renders the users list and opens the invitation form from the add button', async () => {
  const user = userEvent.setup();
  renderWithProviders(<InviteMemberPage />);

  expect(screen.getByRole('heading', { name: 'Користувачі' })).toBeInTheDocument();

  // 1. Открываем модалку
  await user.click(screen.getByRole('button', { name: /Додати учасника/ }));

  // 2. Нажимаем на селект выбора роли
  const roleCombobox = await screen.findByRole('combobox', { name: 'Роль' });
  await user.click(roleCombobox);

  // 3. Проверяем только те роли, которые ЕСТЬ в селекте (Викладач и Інструктор)
  expect(await screen.findByText('Викладач')).toBeInTheDocument();
  expect(await screen.findByText('Інструктор')).toBeInTheDocument();

  // 4. Проверяем инпуты формы
  expect(screen.getByLabelText("Ім'я та по-батькові")).toBeInTheDocument();
  expect(screen.getByLabelText('Прізвище')).toBeInTheDocument();
  expect(screen.getByLabelText('Email')).toBeInTheDocument();
  expect(screen.getByLabelText('Номер телефону')).toBeInTheDocument();
}, 10000);

  it('shows invitation records returned from the API', () => {
    mockGetInvitations.mockReturnValue({
      data: [
        {
          id: 'invite-1',
          email: 'student@example.com',
          role: 'STUDENT',
          status: 'PENDING',
          expiresAt: '2026-10-12T10:00:00.000Z',
          emailDelivery: {
            status: 'SENT',
            attempts: 1,
            lastError: null,
            sentAt: '2026-10-05T10:00:01.000Z',
            queuedAt: '2026-10-05T10:00:00.000Z',
          },
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<InviteMemberPage />);

    expect(screen.getByText('student@example.com')).toBeInTheDocument();
    expect(screen.getByText('Студент')).toBeInTheDocument();
    expect(screen.getByText('Очікує активації')).toBeInTheDocument();
    expect(screen.getByText('Надіслано · 1')).toBeInTheDocument();
  });

  it('allows cancelling pending invitations after confirmation only', async () => {
    const user = userEvent.setup();
    mockCancelInvitation.mockReturnValue({ unwrap: () => Promise.resolve() });
    mockGetInvitations.mockReturnValue({
      data: [
        {
          id: 'pending-invitation',
          email: 'pending@example.com',
          role: 'STUDENT',
          status: 'PENDING',
          expiresAt: '2026-10-12T10:00:00.000Z',
        },
        {
          id: 'accepted-invitation',
          email: 'accepted@example.com',
          role: 'TEACHER',
          status: 'ACCEPTED',
          expiresAt: '2026-10-12T10:00:00.000Z',
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<InviteMemberPage />);

    expect(screen.getAllByRole('button', { name: /Дії для pending@example.com/ })).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /Дії для pending@example.com/ }));
    await user.click(screen.getByRole('menuitem', { name: /Скасувати запрошення/ }));
    expect((await screen.findAllByText('Скасувати це запрошення?')).length).toBeGreaterThan(0);
    await user.click(screen.getByRole('button', { name: /^Скасувати$/ }));

    await waitFor(() => {
      expect(mockCancelInvitation).toHaveBeenCalledWith('pending-invitation');
    });
  });

  it('resends a pending invitation after confirmation and hides the action for accepted ones', async () => {
    const user = userEvent.setup();
    mockResendInvitation.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    mockGetInvitations.mockReturnValue({
      data: [
        {
          id: 'pending-invitation',
          email: 'pending@example.com',
          role: 'STUDENT',
          status: 'PENDING',
          expiresAt: '2026-10-12T10:00:00.000Z',
        },
        {
          id: 'accepted-invitation',
          email: 'accepted@example.com',
          role: 'TEACHER',
          status: 'ACCEPTED',
          expiresAt: '2026-10-12T10:00:00.000Z',
        },
      ],
      isLoading: false,
      isFetching: false,
      refetch: vi.fn(),
    });

    renderWithProviders(<InviteMemberPage />);

    expect(screen.getAllByRole('button', { name: /Дії для pending@example.com/ })).toHaveLength(1);
    await user.click(screen.getByRole('button', { name: /Дії для pending@example.com/ }));
    await user.click(screen.getByRole('menuitem', { name: /Надіслати повторно/ }));
    expect(
      await screen.findByText(/Для запрошення буде створено нове посилання/)
    ).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /^Надіслати$/ }));

    await waitFor(() => {
      expect(mockResendInvitation).toHaveBeenCalledWith('pending-invitation');
    });
  });

  it('does not send an invitation when required fields are missing', async () => {
    const user = userEvent.setup();
    renderWithProviders(<InviteMemberPage />);

    await user.click(screen.getByRole('button', { name: /Додати учасника/ }));
    await user.click(screen.getByRole('button', { name: 'Надіслати запрошення' }));

    expect(await screen.findByText('Оберіть роль учасника')).toBeInTheDocument();
    expect(mockSendMemberInvitation).not.toHaveBeenCalled();
  });

  it('sends the member invitation with the selected role and form values', async () => {
    const user = userEvent.setup();
    mockSendMemberInvitation.mockReturnValue({ unwrap: () => Promise.resolve({}) });
    renderWithProviders(<InviteMemberPage />);

    await user.click(screen.getByRole('button', { name: /Додати учасника/ }));
    await user.click(screen.getByRole('combobox', { name: 'Роль' }));
    await user.click(screen.getByText('Інструктор'));
    await user.type(screen.getByLabelText("Ім'я та по-батькові"), 'Олена');
    await user.type(screen.getByLabelText('Прізвище'), 'Коваль');
    await user.type(screen.getByLabelText('Email'), 'olena@example.com');
    await user.type(screen.getByLabelText('Номер телефону'), '0501234567');
    await user.click(screen.getByRole('button', { name: 'Надіслати запрошення' }));

    await waitFor(() => {
      expect(mockSendMemberInvitation).toHaveBeenCalledWith({
        role: 'INSTRUCTOR',
        firstName: 'Олена',
        lastName: 'Коваль',
        email: 'olena@example.com',
        phone: '+380501234567',
      });
    });
  }, 10000);
});

import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';
import { fireEvent, renderWithProviders, screen, waitFor } from '../../../test-utils';
import { SchoolSettingsPage } from '@/modules/organization/pages/SchoolSettingsPage';

const { organization, mockUpdateOrganization, mockDeleteOrganization, mockNavigate } = vi.hoisted(
  () => ({
    organization: {
      id: 'school-1',
      name: 'Автошкола «Драйв»',
      logoUrl: null as string | null,
      timezone: 'Europe/Kyiv',
    },
    mockUpdateOrganization: vi.fn(),
    mockDeleteOrganization: vi.fn(),
    mockNavigate: vi.fn(),
  }),
);

vi.mock('@/store/api/endpoints/organizationApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/api/endpoints/organizationApi')>();
  return {
    ...actual,
    useGetOrganizationQuery: () => ({
      data: organization,
      isLoading: false,
      isError: false,
    }),
    useUpdateOrganizationMutation: () => [mockUpdateOrganization, { isLoading: false }],
    useDeleteOrganizationMutation: () => [mockDeleteOrganization, { isLoading: false }],
  };
});

vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal<typeof import('react-router-dom')>();
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('SchoolSettingsPage', () => {
  beforeEach(() => {
    mockUpdateOrganization.mockReset().mockReturnValue({ unwrap: () => Promise.resolve({}) });
    mockDeleteOrganization.mockReset().mockReturnValue({ unwrap: () => Promise.resolve() });
    mockNavigate.mockReset();
    localStorage.setItem('token', 'token');
  });

  it('shows the school name and timezone', () => {
    renderWithProviders(<SchoolSettingsPage />);

    expect(screen.getByRole('heading', { name: 'Автошкола' })).toBeInTheDocument();
    expect(screen.getByLabelText('Назва')).toHaveValue('Автошкола «Драйв»');
    expect(screen.getByText('Часовий пояс: Europe/Kyiv')).toBeInTheDocument();
  });

  it('saves the name and selected logo as form data', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SchoolSettingsPage />);

    fireEvent.change(screen.getByLabelText('Назва'), { target: { value: 'Нова школа' } });
    const input = document.querySelector('input[type="file"]');
    const file = new File(['logo'], 'logo.png', { type: 'image/png' });
    await user.upload(input as HTMLInputElement, file);
    await user.click(screen.getByRole('button', { name: 'Зберегти зміни' }));

    await waitFor(() => {
      expect(mockUpdateOrganization).toHaveBeenCalledTimes(1);
    });

    const formData = mockUpdateOrganization.mock.calls[0][0] as FormData;
    expect(formData.get('name')).toBe('Нова школа');
    expect(formData.get('logo')).toBeInstanceOf(Blob);
  });

  it('deletes the school after confirmation and returns to login', async () => {
    const user = userEvent.setup();
    renderWithProviders(<SchoolSettingsPage />);

    await user.click(screen.getByRole('button', { name: /Видалити автошколу/ }));
    expect(await screen.findByText('Після видалення ви вийдете із системи.')).toBeInTheDocument();
    const confirmationButtons = screen.getAllByRole('button', { name: /Видалити автошколу/ });
    fireEvent.click(confirmationButtons[confirmationButtons.length - 1]);

    await waitFor(() => {
      expect(mockDeleteOrganization).toHaveBeenCalled();
    });
    expect(mockNavigate).toHaveBeenCalledWith('/login', { replace: true });
    expect(localStorage.getItem('token')).toBeNull();
  });
});

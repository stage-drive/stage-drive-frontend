import {  screen } from '@testing-library/react';
import { AdminDashboardPage } from '@/modules/dashboard/pages/AdminDashboardPage.tsx';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, test, vi } from 'vitest';
import { renderWithProviders } from '../../../../test-utils.tsx';



const mockInvite = vi.hoisted(() =>
  vi.fn(() => ({
    unwrap: vi.fn().mockResolvedValue({}),
  }))
);

vi.mock('@/store/api/endpoints/invitationsApi.ts', () => ({
  useSendInvitationMutation: () => [mockInvite],
}));


describe('AdminDashboardPage', () => {

  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders Open Modal button', () => {
    renderWithProviders(
        <AdminDashboardPage />
    );

    expect(screen.getByRole('button', { name: 'Open Modal' })).toBeInTheDocument();
  });

  test('shows invitation form when modal is opened', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminDashboardPage />);


    await user.click(screen.getByRole('button', { name: 'Open Modal' }));

    expect(screen.getByRole('textbox', { name: 'FirstName' })).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: 'LastName' })).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: 'Email' })).toBeInTheDocument();

    expect(screen.getByRole('textbox', { name: 'Phone' })).toBeInTheDocument();
  });

  test('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminDashboardPage />);


    await user.click(screen.getByRole('button', { name: 'Open Modal' }));

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('Please input your firstName!')).toBeInTheDocument();

    expect(await screen.findByText('Please input your lastName!')).toBeInTheDocument();

    expect(await screen.findByText('Please input your email!')).toBeInTheDocument();

    expect(await screen.findByText('Please input your phone!')).toBeInTheDocument();
  });

  test('sends invitation with form values', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminDashboardPage />);


    await user.click(screen.getByRole('button', { name: 'Open Modal' }));

    await user.type(screen.getByRole('textbox', { name: 'FirstName' }), 'Eduard');

    await user.type(screen.getByRole('textbox', { name: 'LastName' }), 'Bilan');

    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'eduard@example.com');

    await user.type(screen.getByRole('textbox', { name: 'Phone' }), '+380991234567');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(mockInvite).toHaveBeenCalledWith({
      firstName: 'Eduard',
      lastName: 'Bilan',
      email: 'eduard@example.com',
      phone: '+380991234567',
    });
  });

  test('shows success message after invitation is sent', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminDashboardPage />);


    await user.click(screen.getByRole('button', { name: 'Open Modal' }));

    await user.type(screen.getByRole('textbox', { name: 'FirstName' }), 'Eduard');

    await user.type(screen.getByRole('textbox', { name: 'LastName' }), 'Bilan');

    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'eduard@example.com');

    await user.type(screen.getByRole('textbox', { name: 'Phone' }), '+380991234567');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('success sent invitation')).toBeInTheDocument();
  });

  test('shows error message when invitation request fails', async () => {
    const user = userEvent.setup();

    mockInvite.mockImplementationOnce(() => ({
      unwrap: vi.fn().mockRejectedValue(new Error('API error')),
    }));

    renderWithProviders(<AdminDashboardPage />);


    await user.click(screen.getByRole('button', { name: 'Open Modal' }));

    await user.type(screen.getByRole('textbox', { name: 'FirstName' }), 'Eduard');

    await user.type(screen.getByRole('textbox', { name: 'LastName' }), 'Bilan');

    await user.type(screen.getByRole('textbox', { name: 'Email' }), 'eduard@example.com');

    await user.type(screen.getByRole('textbox', { name: 'Phone' }), '+380991234567');

    await user.click(screen.getByRole('button', { name: 'Submit' }));

    expect(await screen.findByText('error sent invitation')).toBeInTheDocument();
  });

});
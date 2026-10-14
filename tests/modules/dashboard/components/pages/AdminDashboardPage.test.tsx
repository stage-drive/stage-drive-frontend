import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { AdminDashboardPage } from '@/modules/dashboard/pages/AdminDashboardPage.tsx';
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

  test('відображає кнопку відкриття вікна', () => {
    renderWithProviders(<AdminDashboardPage />);

    expect(screen.getByRole('button', { name: 'Відкрити вікно' })).toBeInTheDocument();
  });

  test('відображає форму запрошення після відкриття вікна', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminDashboardPage />);

    await user.click(screen.getByRole('button', { name: 'Відкрити вікно' }));

    expect(screen.getByRole('textbox', { name: "Ім'я" })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Прізвище' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Електронна пошта' })).toBeInTheDocument();
    expect(screen.getByRole('textbox', { name: 'Телефон' })).toBeInTheDocument();
  });

  test('відображає помилки валідації при відправленні порожньої форми', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminDashboardPage />);

    await user.click(screen.getByRole('button', { name: 'Відкрити вікно' }));

    await user.click(screen.getByRole('button', { name: 'Надіслати запрошення' }));

    expect(await screen.findByText("Будь ласка, введіть ім'я!")).toBeInTheDocument();

    expect(await screen.findByText('Будь ласка, введіть прізвище!')).toBeInTheDocument();

    expect(await screen.findByText('Будь ласка, введіть електронну пошту!')).toBeInTheDocument();

    expect(await screen.findByText('Будь ласка, введіть номер телефону!')).toBeInTheDocument();
  });

  test('надсилає запрошення з даними форми', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminDashboardPage />);

    await user.click(screen.getByRole('button', { name: 'Відкрити вікно' }));

    await user.type(screen.getByRole('textbox', { name: "Ім'я" }), 'Eduard');
    await user.type(screen.getByRole('textbox', { name: 'Прізвище' }), 'Bilan');
    await user.type(
      screen.getByRole('textbox', { name: 'Електронна пошта' }),
      'eduard@example.com'
    );
    await user.type(screen.getByRole('textbox', { name: 'Телефон' }), '+380991234567');

    await user.click(screen.getByRole('button', { name: 'Надіслати запрошення' }));

    expect(mockInvite).toHaveBeenCalledWith({
      firstName: 'Eduard',
      lastName: 'Bilan',
      email: 'eduard@example.com',
      phone: '+380991234567',
    });
  });

  test('відображає повідомлення про успішне надсилання запрошення', async () => {
    const user = userEvent.setup();

    renderWithProviders(<AdminDashboardPage />);

    await user.click(screen.getByRole('button', { name: 'Відкрити вікно' }));

    await user.type(screen.getByRole('textbox', { name: "Ім'я" }), 'Eduard');
    await user.type(screen.getByRole('textbox', { name: 'Прізвище' }), 'Bilan');
    await user.type(
      screen.getByRole('textbox', { name: 'Електронна пошта' }),
      'eduard@example.com'
    );
    await user.type(screen.getByRole('textbox', { name: 'Телефон' }), '+380991234567');

    await user.click(screen.getByRole('button', { name: 'Надіслати запрошення' }));

    expect(await screen.findByText('success sent invitation')).toBeInTheDocument();
  });

  test('відображає повідомлення про помилку, якщо запрошення не надіслано', async () => {
    const user = userEvent.setup();

    mockInvite.mockImplementationOnce(() => ({
      unwrap: vi.fn().mockRejectedValue(new Error('API error')),
    }));

    renderWithProviders(<AdminDashboardPage />);

    await user.click(screen.getByRole('button', { name: 'Відкрити вікно' }));

    await user.type(screen.getByRole('textbox', { name: "Ім'я" }), 'Eduard');
    await user.type(screen.getByRole('textbox', { name: 'Прізвище' }), 'Bilan');
    await user.type(
      screen.getByRole('textbox', { name: 'Електронна пошта' }),
      'eduard@example.com'
    );
    await user.type(screen.getByRole('textbox', { name: 'Телефон' }), '+380991234567');

    await user.click(screen.getByRole('button', { name: 'Надіслати запрошення' }));

    expect(await screen.findByText('error sent invitation')).toBeInTheDocument();
  });
});

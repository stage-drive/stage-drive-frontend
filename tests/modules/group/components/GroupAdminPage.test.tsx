import { vi } from 'vitest';
import type { ITrainingGroupListItem } from '@/store/api/endpoints/groupsApi';
import type { OrganizationMember } from '@/store/api/endpoints/usersApi';
import { renderWithProviders, screen } from '../../../test-utils';
import GroupPage from '@/modules/group/page/GroupPage.tsx';
import userEvent from '@testing-library/user-event';

const { groups, teachers, mockCreateGroup } = vi.hoisted(() => ({
  groups: [] as ITrainingGroupListItem[],
  teachers: [] as OrganizationMember[],
  mockCreateGroup: vi.fn(),
}));

vi.mock('@/store/api/endpoints/groupsApi', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/api/endpoints/groupsApi')>();

  return {
    ...actual,
    useGetGroupsQuery: () => ({
      data: { groups },
      isLoading: false,
      isError: false,
    }),
    useCreateGroupMutation: () => [mockCreateGroup, { isLoading: false }],
  };
});

vi.mock('@/store/api/endpoints/usersApi.ts', async (importOriginal) => {
  const actual = await importOriginal<typeof import('@/store/api/endpoints/usersApi')>();

  return {
    ...actual,
    useGetOrganizationMembersQuery: () => ({
      data: { users: teachers },
      isLoading: false,
      isError: false,
    }),
  };
});

describe('GroupPage', () => {
  beforeEach(() => {
    groups.length = 0;
    teachers.length = 0;
    mockCreateGroup.mockReset();
  });


  it('rejects end date earlier than start date', async () => {
    const user = userEvent.setup();

    renderWithProviders(<GroupPage />);

    await user.click(screen.getByRole('button', { name: 'Створити групу' }));

    await user.type(screen.getByLabelText('Назва групи'), 'ПДР — Група А');

    await user.click(screen.getByLabelText('Викладач'));


    const dateInputs = document.querySelectorAll(
      'input[placeholder="Дата початку"], input[placeholder="Дата завершення"]'
    );

    await user.type(dateInputs[0] as HTMLInputElement, '15.06.2026');
    await user.type(dateInputs[1] as HTMLInputElement, '10.06.2026');

    await user.click(screen.getByRole('button', { name: 'Створити' }));

    expect(
      await screen.findByText('Дата завершення не може бути раніше дати початку')
    ).toBeInTheDocument();

    expect(mockCreateGroup).not.toHaveBeenCalled();
  });


  it('shows validation errors when required fields are empty', async () => {
    const user = userEvent.setup();

    renderWithProviders(<GroupPage />);

    await user.click(screen.getByRole('button', { name: 'Створити групу' }));

    await user.click(screen.getByRole('button', { name: 'Створити' }));

    expect(await screen.findByText('Введіть назву групи')).toBeInTheDocument();

    expect(screen.getAllByText('Оберіть викладача').length).toBeGreaterThan(0);
    expect(screen.getByText('Оберіть дату початку')).toBeInTheDocument();
    const errors = screen.getAllByText(
      /Введіть назву групи|Оберіть викладача|Оберіть дату початку|Оберіть дату завершення/,
      { selector: '.ant-form-item-explain-error' }
    );

    expect(errors).toHaveLength(4);
    expect(mockCreateGroup).not.toHaveBeenCalled();

    expect(mockCreateGroup).not.toHaveBeenCalled();
  });


  it('opens create group modal', async () => {
    const user = userEvent.setup();

    renderWithProviders(<GroupPage />);

    await user.click(screen.getByRole('button', { name: 'Створити групу' }));

    expect(screen.getByText('Створення навчальної групи')).toBeInTheDocument();

    expect(screen.getByLabelText('Назва групи')).toBeInTheDocument();
    expect(screen.getByLabelText('Викладач')).toBeInTheDocument();
  });

  it('renders available teachers in select', async () => {
    const user = userEvent.setup();

    teachers.push({
      id: 'teacher-1',
      firstName: 'Іван',
      lastName: 'Петренко',
      email: 'ivan@example.com',
      role: 'TEACHER',
      status: 'ACTIVE',
      organizationId: 'school-1',
      cars: [],
    });

    renderWithProviders(<GroupPage />);

    await user.click(screen.getByRole('button', { name: 'Створити групу' }));

    await user.click(screen.getByLabelText('Викладач'));

    expect(await screen.findByText('Іван Петренко')).toBeInTheDocument();
  });


  it('renders page title and create button', () => {
    renderWithProviders(<GroupPage />);

    expect(screen.getByText('Навчальні групи')).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Створити групу' })).toBeInTheDocument();
  });

  it('renders training groups in the table', () => {
    groups.push({
      id: 'group-1',
      name: 'ПДР — Група А',
      status: 'ACTIVE',
      startDate: '2026-01-10',
      endDate: '2026-06-10',
      teacher: {
        id: 'teacher-1',
        firstName: 'Іван',
        lastName: 'Петренко',
      },
      studentsCount: 15,
      createdAt: '2026-01-01T10:00:00.000Z',
    });

    renderWithProviders(<GroupPage />);

    expect(screen.getByText('ПДР — Група А')).toBeInTheDocument();
    expect(screen.getByText('Іван Петренко')).toBeInTheDocument();
    expect(screen.getByText('ACTIVE')).toBeInTheDocument();
    expect(screen.getByText('15')).toBeInTheDocument();
    expect(screen.getByText('10.01.2026')).toBeInTheDocument();
    expect(screen.getByText('10.06.2026')).toBeInTheDocument();
  });
});

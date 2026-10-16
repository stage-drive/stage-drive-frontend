import { Button, Dropdown, Table } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { formatUkrainianPhone } from '@/shared/utils/ukrainianPhone';
import { useGetStudentQuery, type StudentListItem } from '@/store/api/endpoints/studentsApi';

const transmissionLabels = {
  MANUAL: 'Механіка',
  AUTOMATIC: 'Автомат',
} as const;

const CategoryCell = ({ id }: { id: string }) => {
  const { data } = useGetStudentQuery(id);
  return data?.student?.category ?? '—';
};

const TransmissionCell = ({ id }: { id: string }) => {
  const { data } = useGetStudentQuery(id);
  const transmission = data?.student?.transmission;
  return transmission ? transmissionLabels[transmission] : '—';
};

const columns: TableColumnsType<StudentListItem> = [
  { title: "Ім'я", dataIndex: 'firstName', key: 'firstName' },
  { title: 'Прізвище', dataIndex: 'lastName', key: 'lastName' },
  { title: 'Email', dataIndex: 'email', key: 'email' },
  {
    title: 'Телефон',
    dataIndex: 'phone',
    key: 'phone',
    render: (phone: StudentListItem['phone']) => (phone ? formatUkrainianPhone(phone) : '—'),
  },
  {
    title: 'Категорія',
    key: 'category',
    render: (_value, student) => <CategoryCell id={student.id} />,
  },
  {
    title: 'Коробка передач',
    key: 'transmission',
    render: (_value, student) => <TransmissionCell id={student.id} />,
  },
];

interface StudentsTableProps {
  students: StudentListItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  deletingId: string | null;
  onChange: TableProps<StudentListItem>['onChange'];
  onEdit: (student: StudentListItem) => void;
  onDelete: (student: StudentListItem) => void;
}

export const StudentsTable = ({
  students,
  loading,
  page,
  pageSize,
  total,
  deletingId,
  onChange,
  onEdit,
  onDelete,
}: StudentsTableProps) => (
  <Table<StudentListItem>
    rowKey="id"
    columns={[
      ...columns,
      {
        title: 'Дії',
        key: 'actions',
        width: 80,
        render: (_value, student) => (
          <Dropdown
            trigger={['click']}
            menu={{
              items: [
                { key: 'edit', icon: <EditOutlined />, label: 'Редагувати' },
                {
                  key: 'delete',
                  icon: <DeleteOutlined />,
                  label: 'Видалити',
                  danger: true,
                  disabled: student.status === 'ARCHIVED',
                },
              ],
              onClick: ({ key }) => {
                if (key === 'edit') onEdit(student);
                if (key === 'delete') onDelete(student);
              },
            }}
          >
            <Button
              aria-label={`Дії для ${student.lastName} ${student.firstName}`}
              icon={<EllipsisOutlined />}
              loading={deletingId === student.id}
            />
          </Dropdown>
        ),
      },
    ]}
    dataSource={students}
    loading={loading}
    onChange={onChange}
    locale={{ emptyText: 'Студентів поки немає' }}
    style={{ marginTop: 24 }}
    scroll={{ x: 800 }}
    pagination={{
      current: page,
      pageSize,
      total,
      showSizeChanger: false,
    }}
  />
);

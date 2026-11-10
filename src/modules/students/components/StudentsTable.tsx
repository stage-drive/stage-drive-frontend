import { useState, type Key } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, Dropdown, Table, Tag, theme } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { formatUkrainianPhone } from '@/shared/utils/ukrainianPhone';
import type { StudentAccountStatus, StudentListItem } from '@/store/api/endpoints/studentsApi';
import {
  ACCOUNT_STATUS_COLORS,
  ACCOUNT_STATUS_LABELS,
  TRANSMISSION_LABELS,
} from '@/modules/students/constants';

const columns: TableColumnsType<StudentListItem> = [
  { title: "Ім'я", dataIndex: 'firstName', key: 'firstName', sorter: true },
  { title: 'Прізвище', dataIndex: 'lastName', key: 'lastName', sorter: true },
  { title: 'Email', dataIndex: 'email', key: 'email', sorter: true },
  {
    title: 'Телефон',
    dataIndex: 'phone',
    key: 'phone',
    sorter: true,
    render: (phone: StudentListItem['phone']) => (phone ? formatUkrainianPhone(phone) : '—'),
  },
  {
    title: 'Категорія',
    dataIndex: 'category',
    key: 'category',
    render: (category: StudentListItem['category']) => category ?? '—',
  },
  {
    title: 'Коробка передач',
    dataIndex: 'transmission',
    key: 'transmission',
    render: (transmission: StudentListItem['transmission']) =>
      transmission ? TRANSMISSION_LABELS[transmission] : '—',
  },
  {
    title: 'Статус акаунта',
    dataIndex: 'status',
    key: 'status',
    sorter: true,
    render: (status: StudentAccountStatus) => (
      <Tag color={ACCOUNT_STATUS_COLORS[status]}>{ACCOUNT_STATUS_LABELS[status]}</Tag>
    ),
  },
];

interface StudentsTableProps {
  students: StudentListItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  deletingId: string | null;
  cardPathPrefix: string;
  mode?: 'manage' | 'view';
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
  cardPathPrefix,
  mode = 'manage',
  onChange,
  onEdit,
  onDelete,
}: StudentsTableProps) => {
  const navigate = useNavigate();
  const [selectedRowKeys, setSelectedRowKeys] = useState<Key[]>([]);
  const { token } = theme.useToken();

  return (
    <Card
      styles={{ body: { padding: 0 } }}
      style={{
        marginTop: 24,
        background: token.colorBgContainer,
        overflow: 'hidden',
      }}
    >
      <Table<StudentListItem>
        rowKey="id"
        rowSelection={
          mode === 'manage'
            ? {
                selectedRowKeys,
                onChange: setSelectedRowKeys,
              }
            : undefined
        }
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
                    { key: 'view', icon: <EyeOutlined />, label: 'Переглянути' },
                    ...(mode === 'manage'
                      ? [
                          { key: 'edit', icon: <EditOutlined />, label: 'Редагувати' },
                          {
                            key: 'archive',
                            icon: <DeleteOutlined />,
                            label: 'Архівувати',
                            danger: true,
                            disabled: student.status === 'ARCHIVED',
                          },
                        ]
                      : []),
                  ],
                  onClick: ({ key }) => {
                    if (key === 'view') navigate(`${cardPathPrefix}/${student.id}`);
                    if (key === 'edit') onEdit(student);
                    if (key === 'archive') onDelete(student);
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
        scroll={{ x: 800 }}
        pagination={{
          current: page,
          pageSize,
          total,
          showSizeChanger: false,
        }}
      />
    </Card>
  );
};

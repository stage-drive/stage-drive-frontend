import { useNavigate } from 'react-router-dom';
import { Button, Card, Dropdown, Table, Tag, theme } from 'antd';
import type { TableColumnsType, TableProps } from 'antd';
import { EditOutlined, EllipsisOutlined, EyeOutlined } from '@ant-design/icons';
import { CAR_STATUS_COLORS, CAR_STATUS_LABELS } from '@/modules/cars/constants';
import { TRANSMISSION_LABELS } from '@/modules/students/constants';
import type { CarListItem, CarStatus } from '@/store/api/endpoints/carsApi';

const columns: TableColumnsType<CarListItem> = [
  { title: 'Номер', dataIndex: 'plateNumber', key: 'plateNumber', sorter: true },
  { title: 'Категорія', dataIndex: 'category', key: 'category', sorter: true },
  {
    title: 'Коробка передач',
    dataIndex: 'transmission',
    key: 'transmission',
    sorter: true,
    render: (transmission: CarListItem['transmission']) => TRANSMISSION_LABELS[transmission],
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (status: CarStatus) => (
      <Tag color={CAR_STATUS_COLORS[status]}>{CAR_STATUS_LABELS[status]}</Tag>
    ),
  },
  {
    title: 'Інструктор',
    key: 'instructor',
    render: (_value, car) =>
      car.instructor ? `${car.instructor.lastName} ${car.instructor.firstName}` : '—',
  },
];

interface CarsTableProps {
  cars: CarListItem[];
  loading: boolean;
  page: number;
  pageSize: number;
  total: number;
  cardPathPrefix: string;
  mode?: 'manage' | 'view';
  onChange: TableProps<CarListItem>['onChange'];
  onEdit: (car: CarListItem) => void;
}

export const CarsTable = ({
  cars,
  loading,
  page,
  pageSize,
  total,
  cardPathPrefix,
  mode = 'manage',
  onChange,
  onEdit,
}: CarsTableProps) => {
  const navigate = useNavigate();
  const { token } = theme.useToken();

  return (
    <Card
      styles={{ body: { padding: 0 } }}
      style={{ marginTop: 24, background: token.colorBgContainer, overflow: 'hidden' }}
    >
      <Table<CarListItem>
        rowKey="id"
        columns={[
          ...columns,
          {
            title: 'Дії',
            key: 'actions',
            width: 80,
            render: (_value, car) => (
              <Dropdown
                trigger={['click']}
                menu={{
                  items: [
                    { key: 'view', icon: <EyeOutlined />, label: 'Переглянути' },
                    ...(mode === 'manage'
                      ? [{ key: 'edit', icon: <EditOutlined />, label: 'Редагувати' }]
                      : []),
                  ],
                  onClick: ({ key }) => {
                    if (key === 'view') navigate(`${cardPathPrefix}/${car.id}`);
                    if (key === 'edit') onEdit(car);
                  },
                }}
              >
                <Button
                  aria-label={`Дії для ${car.plateNumber}`}
                  icon={<EllipsisOutlined />}
                />
              </Dropdown>
            ),
          },
        ]}
        dataSource={cars}
        loading={loading}
        onChange={onChange}
        locale={{ emptyText: 'Автомобілів поки немає' }}
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

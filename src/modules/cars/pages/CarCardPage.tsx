import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  Alert,
  App,
  Breadcrumb,
  Button,
  Card,
  Descriptions,
  Empty,
  Flex,
  Form,
  Skeleton,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import { EditOutlined, SwapOutlined, UserOutlined } from '@ant-design/icons';
import { AssignInstructorModal } from '@/modules/cars/components/AssignInstructorModal';
import { CarFormModal, type CarFormValues } from '@/modules/cars/components/CarFormModal';
import { CarStatusModal } from '@/modules/cars/components/CarStatusModal';
import { CAR_CATEGORIES, CAR_STATUS_COLORS, CAR_STATUS_LABELS } from '@/modules/cars/constants';
import {
  canChangeInstructor,
  getApiErrorMessage,
  nextCarStatuses,
  normalizePlateNumber,
} from '@/modules/cars/utils/carActions';
import { CATEGORY_LABELS, TRANSMISSION_LABELS } from '@/modules/students/constants';
import {
  useAssignCarInstructorMutation,
  useGetCarsQuery,
  useUpdateCarMutation,
  useUpdateCarStatusMutation,
  type CarStatus,
} from '@/store/api/endpoints/carsApi';
const { Title, Text } = Typography;

interface CarCardPageProps {
  mode?: 'manage' | 'view';
  listPath?: string;
}

export const CarCardPage = ({ mode = 'manage', listPath = '/admin/cars' }: CarCardPageProps) => {
  const { id = '' } = useParams<{ id: string }>();
  const { message } = App.useApp();
  const [editForm] = Form.useForm<CarFormValues>();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isStatusOpen, setIsStatusOpen] = useState(false);
  const [isInstructorOpen, setIsInstructorOpen] = useState(false);

  const { data, isLoading, isError } = useGetCarsQuery({ limit: 100 });
  const car = data?.cars.find((item) => item.id === id);
  const [updateCar, { isLoading: isSaving }] = useUpdateCarMutation();
  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateCarStatusMutation();
  const [assignInstructor, { isLoading: isAssigning }] = useAssignCarInstructorMutation();

  const instructorChange = car ? canChangeInstructor(car) : { enabled: false, reason: '' };

  const onEdit = async (values: CarFormValues) => {
    if (!car) return;
    try {
      await updateCar({
        id: car.id,
        body: {
          plateNumber: normalizePlateNumber(values.plateNumber),
          category: values.category,
          transmission: values.transmission,
        },
      }).unwrap();
      message.success('Автомобіль збережено');
      setIsEditOpen(false);
      editForm.resetFields();
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Не вдалося зберегти автомобіль'));
    }
  };

  const onStatus = async (status: CarStatus) => {
    if (!car) return;
    try {
      await updateStatus({ id: car.id, body: { status } }).unwrap();
      message.success('Статус автомобіля змінено');
      setIsStatusOpen(false);
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Не вдалося змінити статус'));
    }
  };

  const onInstructor = async (instructorId: string | null) => {
    if (!car) return;
    try {
      await assignInstructor({ id: car.id, body: { instructorId } }).unwrap();
      message.success(instructorId ? 'Інструктора призначено' : 'Інструктора знято');
      setIsInstructorOpen(false);
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Не вдалося змінити інструктора'));
    }
  };

  if (isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (isError || !car) {
    return (
      <Flex vertical gap={16}>
        <Breadcrumb items={[{ title: <Link to={listPath}>Автопарк</Link> }, { title: 'Автомобіль' }]} />
        <Alert type="error" showIcon title="Не вдалося завантажити автомобіль" />
      </Flex>
    );
  }

  return (
    <Flex vertical gap={24}>
      <Breadcrumb
        items={[{ title: <Link to={listPath}>Автопарк</Link> }, { title: car.plateNumber }]}
      />
      <Card>
        <Flex vertical gap={20}>
          <Flex align="flex-start" justify="space-between" gap={16} wrap>
            <Flex align="center" gap={8} wrap>
              <Title level={3} style={{ margin: 0 }}>
                {car.plateNumber}
              </Title>
              <Tag color={CAR_STATUS_COLORS[car.status]}>{CAR_STATUS_LABELS[car.status]}</Tag>
              <Tag>{car.category}</Tag>
              <Tag>{TRANSMISSION_LABELS[car.transmission]}</Tag>
            </Flex>
            {mode === 'manage' ? (
              <Flex gap={8} wrap>
                <Button
                  icon={<EditOutlined />}
                  onClick={() => {
                    editForm.setFieldsValue({
                      plateNumber: car.plateNumber,
                      category: CAR_CATEGORIES.find((item) => item === car.category),
                      transmission: car.transmission,
                    });
                    setIsEditOpen(true);
                  }}
                >
                  Редагувати
                </Button>
                <Tooltip title={instructorChange.enabled ? undefined : instructorChange.reason}>
                  <span>
                    <Button
                      icon={<UserOutlined />}
                      disabled={!instructorChange.enabled}
                      onClick={() => setIsInstructorOpen(true)}
                    >
                      Інструктор
                    </Button>
                  </span>
                </Tooltip>
                <Button icon={<SwapOutlined />} onClick={() => setIsStatusOpen(true)}>
                  Статус
                </Button>
              </Flex>
            ) : null}
          </Flex>

          <Descriptions column={1} bordered size="small">
            <Descriptions.Item label="Державний номер">{car.plateNumber}</Descriptions.Item>
            <Descriptions.Item label="Категорія">
              {CATEGORY_LABELS[car.category] ?? car.category}
            </Descriptions.Item>
            <Descriptions.Item label="Коробка передач">
              {TRANSMISSION_LABELS[car.transmission]}
            </Descriptions.Item>
            <Descriptions.Item label="Статус">{CAR_STATUS_LABELS[car.status]}</Descriptions.Item>
            <Descriptions.Item label="Інструктор">
              {car.instructor ? (
                `${car.instructor.lastName} ${car.instructor.firstName}`
              ) : (
                <Text type="secondary">Інструктора не призначено</Text>
              )}
            </Descriptions.Item>
          </Descriptions>
          <Empty description="Історія використання з’явиться після модуля практичних занять" />
        </Flex>
      </Card>

      {mode === 'manage' ? (
        <>
          <CarFormModal
            open={isEditOpen}
            form={editForm}
            isSending={isSaving}
            title={`Редагувати ${car.plateNumber}`}
            okText="Зберегти"
            onClose={() => {
              editForm.resetFields();
              setIsEditOpen(false);
            }}
            onSubmit={onEdit}
          />
          <CarStatusModal
            open={isStatusOpen}
            isSending={isUpdatingStatus}
            options={nextCarStatuses(car.status)}
            onClose={() => setIsStatusOpen(false)}
            onSubmit={onStatus}
          />
          <AssignInstructorModal
            open={isInstructorOpen}
            isSending={isAssigning}
            canClear={Boolean(car.instructorId)}
            onClose={() => setIsInstructorOpen(false)}
            onSubmit={onInstructor}
          />
        </>
      ) : null}
    </Flex>
  );
};

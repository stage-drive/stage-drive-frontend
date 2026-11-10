import { useState } from 'react';
import { Alert, App, Button, Flex, Form, Input, Select } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { CarFormModal, type CarFormValues } from '@/modules/cars/components/CarFormModal';
import { CarsTable } from '@/modules/cars/components/CarsTable';
import { CAR_CATEGORIES, CAR_STATUS_LABELS } from '@/modules/cars/constants';
import {
  getApiErrorMessage,
  isCarSortField,
  normalizePlateNumber,
} from '@/modules/cars/utils/carActions';
import { CATEGORY_LABELS, TRANSMISSION_LABELS } from '@/modules/students/constants';
import {
  useCreateCarMutation,
  useGetCarsQuery,
  useUpdateCarMutation,
  type CarListItem,
  type CarSortBy,
  type CarStatus,
} from '@/store/api/endpoints/carsApi';
import type { StudentTransmission } from '@/store/api/endpoints/studentsApi';
import { useGetOrganizationMembersQuery } from '@/store/api/endpoints/usersApi';

const PAGE_SIZE = 20;

interface CarsPageProps {
  mode?: 'manage' | 'view';
  cardPathPrefix?: string;
}

const statusOptions = (Object.keys(CAR_STATUS_LABELS) as CarStatus[]).map((value) => ({
  value,
  label: CAR_STATUS_LABELS[value],
}));

const transmissionOptions = (Object.keys(TRANSMISSION_LABELS) as StudentTransmission[]).map(
  (value) => ({ value, label: TRANSMISSION_LABELS[value] }),
);

export const CarsPage = ({ mode = 'manage', cardPathPrefix = '/admin/cars' }: CarsPageProps) => {
  const [addForm] = Form.useForm<CarFormValues>();
  const [editForm] = Form.useForm<CarFormValues>();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingCar, setEditingCar] = useState<CarListItem | null>(null);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<(typeof CAR_CATEGORIES)[number]>();
  const [transmission, setTransmission] = useState<StudentTransmission>();
  const [status, setStatus] = useState<CarStatus>();
  const [instructorId, setInstructorId] = useState<string>();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<CarSortBy>('plateNumber');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const { message } = App.useApp();

  const { data: instructorsData } = useGetOrganizationMembersQuery(
    { role: 'INSTRUCTOR', status: 'ACTIVE', limit: 100 },
    { skip: mode !== 'manage' },
  );
  const { data, isLoading, isFetching, error } = useGetCarsQuery({
    search,
    category,
    transmission,
    status,
    instructorId,
    sortBy,
    sortOrder,
    page,
    limit: PAGE_SIZE,
  });
  const [createCar, { isLoading: isCreating }] = useCreateCarMutation();
  const [updateCar, { isLoading: isSaving }] = useUpdateCarMutation();

  const instructorOptions = (instructorsData?.users ?? []).map((user) => ({
    value: user.id,
    label: `${user.lastName} ${user.firstName}`,
  }));

  const onCreate = async (values: CarFormValues) => {
    if (!values.instructorId) return;
    try {
      await createCar({
        plateNumber: normalizePlateNumber(values.plateNumber),
        category: values.category,
        transmission: values.transmission,
        instructorId: values.instructorId,
      }).unwrap();
      message.success('Автомобіль додано');
      setIsAddOpen(false);
      addForm.resetFields();
    } catch (createError: unknown) {
      message.error(getApiErrorMessage(createError, 'Не вдалося додати автомобіль'));
    }
  };

  const openEdit = (car: CarListItem) => {
    editForm.setFieldsValue({
      plateNumber: car.plateNumber,
      category: CAR_CATEGORIES.find((item) => item === car.category),
      transmission: car.transmission,
    });
    setEditingCar(car);
  };

  const onEdit = async (values: CarFormValues) => {
    if (!editingCar) return;
    try {
      await updateCar({
        id: editingCar.id,
        body: {
          plateNumber: normalizePlateNumber(values.plateNumber),
          category: values.category,
          transmission: values.transmission,
        },
      }).unwrap();
      message.success('Автомобіль збережено');
      setEditingCar(null);
      editForm.resetFields();
    } catch (editError: unknown) {
      message.error(getApiErrorMessage(editError, 'Не вдалося зберегти автомобіль'));
    }
  };

  const onTableChange: TableProps<CarListItem>['onChange'] = (pagination, _filters, sorter) => {
    setPage(pagination.current ?? 1);
    if (!Array.isArray(sorter) && typeof sorter.field === 'string' && isCarSortField(sorter.field)) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order === 'descend' ? 'desc' : 'asc');
    }
  };

  return (
    <Flex vertical>
      <Flex align="center" justify="space-between" wrap gap={12}>
        <Flex gap={12} wrap>
          <Input.Search
            allowClear
            placeholder="Пошук за номером"
            onSearch={(value) => {
              setSearch(value.trim());
              setPage(1);
            }}
            style={{ width: 240 }}
          />
          <Select
            allowClear
            placeholder="Категорія"
            value={category}
            options={CAR_CATEGORIES.map((item) => ({ value: item, label: CATEGORY_LABELS[item] }))}
            onChange={(value) => {
              setCategory(value);
              setPage(1);
            }}
            style={{ width: 220 }}
          />
          <Select
            allowClear
            placeholder="Коробка"
            value={transmission}
            options={transmissionOptions}
            onChange={(value) => {
              setTransmission(value);
              setPage(1);
            }}
            style={{ width: 160 }}
          />
          <Select
            allowClear
            placeholder="Статус"
            value={status}
            options={statusOptions}
            onChange={(value) => {
              setStatus(value);
              setPage(1);
            }}
            style={{ width: 200 }}
          />
          {mode === 'manage' ? (
            <Select
              allowClear
              showSearch
              optionFilterProp="label"
              placeholder="Інструктор"
              value={instructorId}
              options={instructorOptions}
              onChange={(value) => {
                setInstructorId(value);
                setPage(1);
              }}
              style={{ width: 220 }}
            />
          ) : null}
        </Flex>
        {mode === 'manage' ? (
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              addForm.resetFields();
              setIsAddOpen(true);
            }}
          >
            Додати автомобіль
          </Button>
        ) : null}
      </Flex>

      {error ? (
        <Alert
          type="error"
          showIcon
          title="Не вдалося завантажити список автомобілів"
          style={{ marginTop: 24 }}
        />
      ) : null}

      <CarsTable
        cars={data?.cars ?? []}
        loading={isLoading || isFetching}
        page={page}
        pageSize={PAGE_SIZE}
        total={data?.pagination.total ?? 0}
        cardPathPrefix={cardPathPrefix}
        mode={mode}
        onChange={onTableChange}
        onEdit={openEdit}
      />

      {mode === 'manage' ? (
        <>
          <CarFormModal
            open={isAddOpen}
            form={addForm}
            isSending={isCreating}
            title="Додати автомобіль"
            okText="Зберегти"
            showInstructor
            onClose={() => {
              addForm.resetFields();
              setIsAddOpen(false);
            }}
            onSubmit={onCreate}
          />
          <CarFormModal
            open={Boolean(editingCar)}
            form={editForm}
            isSending={isSaving}
            title={editingCar ? `Редагувати ${editingCar.plateNumber}` : 'Редагувати автомобіль'}
            okText="Зберегти"
            onClose={() => {
              editForm.resetFields();
              setEditingCar(null);
            }}
            onSubmit={onEdit}
          />
        </>
      ) : null}
    </Flex>
  );
};

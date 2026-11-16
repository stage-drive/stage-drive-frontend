import {useState } from 'react';
import {
  Alert,
  Button,
  DatePicker,
  Form,
  Input,
  message,
  Modal,
  Select,
  Space,
  Table,
  Tag,
  Typography,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import dayjs, { Dayjs } from 'dayjs';

import type { ICreateGroup, ITrainingGroupListItem } from '@/store/api/endpoints/groupsApi';
import { useCreateGroupMutation, useGetGroupsQuery } from '@/store/api/endpoints/groupsApi';
import { useGetOrganizationMembersQuery } from '@/store/api/endpoints/usersApi.ts';

const { Title } = Typography;

interface GroupFormValues {
  name: string;
  teacherId: string;
  startDate: Dayjs;
  endDate: Dayjs;
}

const getErrorMessage = (error: unknown): string => {
  if (typeof error !== 'object' || error === null) {
    return 'Сталася невідома помилка';
  }

  if ('data' in error && typeof error.data === 'object' && error.data !== null) {
    const data = error.data as {
      message?: string;
      errors?: { field: string; message: string }[];
    };

    if (data.errors?.length) {
      return data.errors.map((item) => `${item.field}: ${item.message}`).join('\n');
    }

    if (data.message) {
      return data.message;
    }
  }

  return 'Не вдалося виконати запит';
};

const GroupPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm<GroupFormValues>();

  const { data, isLoading, isError, error } = useGetGroupsQuery();

  const [createGroup, { isLoading: isCreating }] = useCreateGroupMutation();

  const groups = data?.groups ?? [];

  const { data: teachersData } = useGetOrganizationMembersQuery({
    role: 'TEACHER',
    status: 'ACTIVE',
  });

  const teachers = teachersData?.users ?? [];


  const handleCreateGroup = async (values: GroupFormValues) => {
    const payload: ICreateGroup = {
      name: values.name.trim(),
      teacherId: values.teacherId,
      startDate: values.startDate.format('YYYY-MM-DD'),
      endDate: values.endDate.format('YYYY-MM-DD'),
    };

    try {
      await createGroup(payload).unwrap();

      message.success('Групу успішно створено');

      form.resetFields();
      setIsModalOpen(false);
    } catch (error) {
      message.error(getErrorMessage(error));
    }
  };

  const handleCloseModal = () => {
    form.resetFields();
    setIsModalOpen(false);
  };

  const columns: ColumnsType<ITrainingGroupListItem> = [
    {
      title: 'Назва групи',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Викладач',
      key: 'teacher',
      render: (_, record) => `${record.teacher.firstName} ${record.teacher.lastName}`,
    },
    {
      title: 'Статус',
      dataIndex: 'status',
      key: 'status',
      render: (status) => <Tag>{status}</Tag>,
    },
    {
      title: 'Дата початку',
      dataIndex: 'startDate',
      key: 'startDate',
      render: (date: string | null) => (date ? dayjs(date).format('DD.MM.YYYY') : '—'),
    },
    {
      title: 'Дата завершення',
      dataIndex: 'endDate',
      key: 'endDate',
      render: (date: string | null) => (date ? dayjs(date).format('DD.MM.YYYY') : '—'),
    },
    {
      title: 'Кількість студентів',
      dataIndex: 'studentsCount',
      key: 'studentsCount',
    },
    {
      title: 'Створено',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => dayjs(date).format('DD.MM.YYYY'),
    },
  ];

  return (
    <div>
      <Space
        style={{
          width: '100%',
          justifyContent: 'space-between',
          marginBottom: 24,
        }}
      >
        <Title level={3}>Навчальні групи</Title>

        <Button type="primary" onClick={() => setIsModalOpen(true)}>
          Створити групу
        </Button>
      </Space>

      {isError && (
        <Alert
          type="error"
          message={getErrorMessage(error)}
          showIcon
          style={{ marginBottom: 16 }}
        />
      )}

      <Table<ITrainingGroupListItem>
        columns={columns}
        dataSource={groups}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Всього груп: ${total}`,
        }}
        scroll={{ x: 800 }}
        locale={{
          emptyText: 'Груп поки немає',
        }}
      />

      <Modal
        title="Створення навчальної групи"
        open={isModalOpen}
        onCancel={handleCloseModal}
        onOk={() => form.submit()}
        okText="Створити"
        cancelText="Скасувати"
        confirmLoading={isCreating}
        destroyOnHidden
      >
        <Form form={form} layout="vertical" onFinish={handleCreateGroup}>
          <Form.Item
            label="Назва групи"
            name="name"
            rules={[
              { required: true, message: 'Введіть назву групи' },
              { whitespace: true, message: 'Назва не може бути порожньою' },
            ]}
          >
            <Input placeholder="Наприклад, ПДР — Група А" />
          </Form.Item>

          <Form.Item
            label="Викладач"
            name="teacherId"
            rules={[{ required: true, message: 'Оберіть викладача' }]}
          >
            <Select
              placeholder="Оберіть викладача"
              showSearch
              optionFilterProp="label"
              options={teachers?.map((teacher) => ({
                value: teacher.id,
                label: `${teacher.firstName} ${teacher.lastName}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Дата початку"
            name="startDate"
            rules={[{ required: true, message: 'Оберіть дату початку' }]}
          >
            <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} placeholder="Дата початку" />
          </Form.Item>

          <Form.Item
            label="Дата завершення"
            name="endDate"
            dependencies={['startDate']}
            rules={[
              { required: true, message: 'Оберіть дату завершення' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  const startDate = getFieldValue('startDate');

                  if (
                    !value ||
                    !startDate ||
                    value.isSame(startDate, 'day') ||
                    value.isAfter(startDate, 'day')
                  ) {
                    return Promise.resolve();
                  }

                  return Promise.reject(
                    new Error('Дата завершення не може бути раніше дати початку')
                  );
                },
              }),
            ]}
          >
            <DatePicker
              format="DD.MM.YYYY"
              style={{ width: '100%' }}
              placeholder="Дата завершення"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default GroupPage;

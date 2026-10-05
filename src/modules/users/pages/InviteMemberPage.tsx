import React, { useState } from 'react';
import {
  Alert,
  App,
  Button,
  Dropdown,
  Flex,
  Form,
  Input,
  Modal,
  Select,
  Table,
  Tag,
  Tooltip,
  Typography,
} from 'antd';
import {
  EllipsisOutlined,
  MailOutlined,
  PlusOutlined,
  ReloadOutlined,
  StopOutlined,
} from '@ant-design/icons';
import type { TableColumnsType } from 'antd';
import {
  useGetInvitationsQuery,
  useCancelInvitationMutation,
  useResendInvitationMutation,
  useSendMemberInvitationMutation,
  type InvitationItem,
  type SendMemberInviteRequest,
} from '../../../store/api/endpoints/invitationsApi';
import { PhoneInput } from '../../../shared/components/PhoneInput';
import {
  normalizeUkrainianPhone,
  validateUkrainianPhone,
} from '../../../shared/utils/ukrainianPhone';

const { Title, Paragraph } = Typography;

const roleLabels: Record<InvitationItem['role'], string> = {
  OWNER: 'Власник',
  ADMIN: 'Адміністратор',
  TEACHER: 'Викладач',
  INSTRUCTOR: 'Інструктор',
  STUDENT: 'Студент',
};

const statusLabels: Record<InvitationItem['status'], string> = {
  PENDING: 'Очікує активації',
  ACCEPTED: 'Активовано',
  CANCELLED: 'Скасовано',
  EXPIRED: 'Термін минув',
};

const statusColors: Record<InvitationItem['status'], string> = {
  PENDING: 'processing',
  ACCEPTED: 'success',
  CANCELLED: 'default',
  EXPIRED: 'error',
};

const deliveryLabels: Record<string, string> = {
  QUEUED: 'У черзі',
  SENT: 'Надіслано',
  FAILED: 'Помилка доставки',
};

const deliveryColors: Record<string, string> = {
  QUEUED: 'processing',
  SENT: 'success',
  FAILED: 'error',
};

const columns: TableColumnsType<InvitationItem> = [
  { title: 'Email', dataIndex: 'email', key: 'email' },
  {
    title: 'Роль',
    dataIndex: 'role',
    key: 'role',
    render: (role: InvitationItem['role']) => roleLabels[role],
  },
  {
    title: 'Статус',
    dataIndex: 'status',
    key: 'status',
    render: (status: InvitationItem['status']) => (
      <Tag color={statusColors[status]}>{statusLabels[status]}</Tag>
    ),
  },
  {
    title: 'Доставка email',
    key: 'emailDelivery',
    render: (_value, invitation) => {
      const delivery = invitation.emailDelivery;
      if (!delivery) return '—';

      const label = deliveryLabels[delivery.status] || delivery.status;
      const tag = (
        <Tag color={deliveryColors[delivery.status] || 'default'}>
          {label} · {delivery.attempts}
        </Tag>
      );
      return delivery.lastError ? <Tooltip title={delivery.lastError}>{tag}</Tooltip> : tag;
    },
  },
  {
    title: 'Створено',
    dataIndex: 'createdAt',
    key: 'createdAt',
    render: (value?: string) => (value ? new Date(value).toLocaleDateString('uk-UA') : '—'),
  },
  {
    title: 'Дійсне до',
    dataIndex: 'expiresAt',
    key: 'expiresAt',
    render: (value: string) => new Date(value).toLocaleDateString('uk-UA'),
  },
];

export const InviteMemberPage: React.FC = () => {
  const [form] = Form.useForm<SendMemberInviteRequest>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancellingInvitationId, setCancellingInvitationId] = useState<string | null>(null);
  const [resendingInvitationId, setResendingInvitationId] = useState<string | null>(null);
  const [sendInvitation, { isLoading: isSending }] = useSendMemberInvitationMutation();
  const [cancelInvitation, { isLoading: isCancelling }] = useCancelInvitationMutation();
  const [resendInvitation, { isLoading: isResending }] = useResendInvitationMutation();
  const {
    data: invitations = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetInvitationsQuery();
  const { message, modal } = App.useApp();

  const onFinish = async (values: SendMemberInviteRequest) => {
    try {
      await sendInvitation({ ...values, phone: normalizeUkrainianPhone(values.phone) }).unwrap();
      message.success('Запрошення успішно створено');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: unknown) {
      const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
      message.error(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Не вдалося надіслати запрошення'
      );
    }
  };

  const onCancelInvitation = async (invitationId: string) => {
    setCancellingInvitationId(invitationId);
    try {
      await cancelInvitation(invitationId).unwrap();
      message.success('Запрошення скасовано');
    } catch (error: unknown) {
      const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
      message.error(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Не вдалося скасувати запрошення'
      );
    } finally {
      setCancellingInvitationId(null);
    }
  };

  const onResendInvitation = async (invitationId: string) => {
    setResendingInvitationId(invitationId);
    try {
      await resendInvitation(invitationId).unwrap();
      message.success('Лист запрошення повторно поставлено в чергу');
    } catch (error: unknown) {
      const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
      message.error(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Не вдалося повторно надіслати запрошення'
      );
    } finally {
      setResendingInvitationId(null);
    }
  };

  return (
    <section>
      <Flex align="center" justify="space-between" wrap gap={16}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Користувачі
          </Title>
          <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
            Учасники та запрошення вашої автошколи
          </Paragraph>
        </div>
        <Flex gap={8}>
          <Button
            aria-label="Оновити список"
            icon={<ReloadOutlined />}
            onClick={() => void refetch()}
            loading={isFetching}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setIsModalOpen(true)}>
            Додати учасника
          </Button>
        </Flex>
      </Flex>

      {error && (
        <Alert
          type="error"
          showIcon
          message="Не вдалося завантажити список користувачів"
          style={{ marginTop: 24 }}
        />
      )}

      <Table<InvitationItem>
        rowKey="id"
        columns={[
          ...columns,
          {
            title: 'Дії',
            key: 'actions',
            render: (_value, invitation) =>
              invitation.status === 'PENDING' ? (
                <Dropdown
                  trigger={['click']}
                  menu={{
                    items: [
                      {
                        key: 'resend',
                        icon: <MailOutlined />,
                        label: 'Надіслати повторно',
                      },
                      {
                        key: 'cancel',
                        icon: <StopOutlined />,
                        label: 'Скасувати запрошення',
                        danger: true,
                      },
                    ],
                    onClick: ({ key }) => {
                      if (key === 'resend') {
                        modal.confirm({
                          title: 'Надіслати запрошення повторно?',
                          content:
                            'Для запрошення буде створено нове посилання, а попереднє перестане діяти.',
                          okText: 'Надіслати',
                          cancelText: 'Не надсилати',
                          onOk: () => onResendInvitation(invitation.id),
                        });
                      }

                      if (key === 'cancel') {
                        modal.confirm({
                          title: 'Скасувати це запрошення?',
                          content: 'Посилання з листа більше не можна буде використати.',
                          okText: 'Скасувати',
                          cancelText: 'Залишити',
                          okButtonProps: { danger: true },
                          onOk: () => onCancelInvitation(invitation.id),
                        });
                      }
                    },
                  }}
                >
                  <Button
                    aria-label={`Дії для ${invitation.email}`}
                    icon={<EllipsisOutlined />}
                    loading={
                      (isResending && resendingInvitationId === invitation.id) ||
                      (isCancelling && cancellingInvitationId === invitation.id)
                    }
                  />
                </Dropdown>
              ) : null,
          },
        ]}
        dataSource={invitations}
        loading={isLoading}
        locale={{ emptyText: 'Запрошень поки немає' }}
        style={{ marginTop: 24 }}
        scroll={{ x: 700 }}
      />

      <Modal
        title="Додати учасника"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnHidden
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          requiredMark={false}
          style={{ marginTop: 24 }}
        >
          <Form.Item
            label="Роль"
            name="role"
            rules={[{ required: true, message: 'Оберіть роль учасника' }]}
          >
            <Select
              placeholder="Оберіть роль"
              options={[
                { value: 'TEACHER', label: 'Викладач' },
                { value: 'INSTRUCTOR', label: 'Інструктор' },
                { value: 'STUDENT', label: 'Студент' },
              ]}
            />
          </Form.Item>

          <Form.Item
            label="Ім'я та по-батькові"
            name="firstName"
            rules={[{ required: true, whitespace: true, message: "Введіть ім'я" }]}
          >
            <Input autoComplete="given-name" />
          </Form.Item>

          <Form.Item
            label="Прізвище"
            name="lastName"
            rules={[{ required: true, whitespace: true, message: 'Введіть прізвище' }]}
          >
            <Input autoComplete="family-name" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введіть email' },
              { type: 'email', message: 'Введіть коректний email' },
            ]}
          >
            <Input autoComplete="email" />
          </Form.Item>

          <Form.Item
            label="Номер телефону"
            name="phone"
            rules={[{ validator: validateUkrainianPhone }]}
          >
            <PhoneInput />
          </Form.Item>

          <Flex justify="flex-end" gap={8}>
            <Button onClick={() => setIsModalOpen(false)}>Скасувати</Button>
            <Button type="primary" htmlType="submit" loading={isSending}>
              Надіслати запрошення
            </Button>
          </Flex>
        </Form>
      </Modal>
    </section>
  );
};

export default InviteMemberPage;

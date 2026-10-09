import React from 'react';
import { Button, Dropdown, Table, Tag, Tooltip } from 'antd';
import type { TableColumnsType } from 'antd';
import { EllipsisOutlined, MailOutlined, StopOutlined } from '@ant-design/icons';
import type { InvitationItem } from '../../../store/api/endpoints/invitationsApi';

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

interface InvitationTableProps {
  invitations: InvitationItem[];
  isLoading: boolean;
  isResending: boolean;
  resendingInvitationId: string | null;
  isCancelling: boolean;
  cancellingInvitationId: string | null;
  onResendInvitation: (invitationId: string) => void;
  onCancelInvitation: (invitationId: string) => void;
}

export const InvitationTable: React.FC<InvitationTableProps> = ({
  invitations,
  isLoading,
  isResending,
  resendingInvitationId,
  isCancelling,
  cancellingInvitationId,
  onResendInvitation,
  onCancelInvitation,
}) => (
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
                  { key: 'resend', icon: <MailOutlined />, label: 'Надіслати повторно' },
                  {
                    key: 'cancel',
                    icon: <StopOutlined />,
                    label: 'Скасувати запрошення',
                    danger: true,
                  },
                ],
                onClick: ({ key }) => {
                  if (key === 'resend') {
                    onResendInvitation(invitation.id);
                  }

                  if (key === 'cancel') {
                    onCancelInvitation(invitation.id);
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
);

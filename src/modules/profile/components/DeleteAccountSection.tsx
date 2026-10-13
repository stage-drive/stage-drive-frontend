import type { FC } from 'react';
import { Alert, Button, Card, Popconfirm } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

interface DeleteAccountSectionProps {
  isDeleting: boolean;
  onDelete: () => void;
}

export const DeleteAccountSection: FC<DeleteAccountSectionProps> = ({ isDeleting, onDelete }) => (
  <Card title="Видалення акаунта">
    <Alert
      type="warning"
      showIcon
      style={{ marginBottom: 16 }}
      title="Після видалення ви вийдете із системи. Цю дію не можна скасувати."
    />
    <Popconfirm
      title="Видалити акаунт?"
      description="Ви втратите доступ до профілю та даних акаунта."
      okText="Видалити акаунт"
      cancelText="Скасувати"
      okButtonProps={{ danger: true, loading: isDeleting }}
      onConfirm={onDelete}
    >
      <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
        Видалити акаунт
      </Button>
    </Popconfirm>
  </Card>
);

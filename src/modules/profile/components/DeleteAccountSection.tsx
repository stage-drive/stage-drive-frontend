import type { FC } from 'react';
import { Button, Card, Flex, Popconfirm, Typography } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';

const { Text } = Typography;

interface DeleteAccountSectionProps {
  isDeleting: boolean;
  onDelete: () => void;
}

export const DeleteAccountSection: FC<DeleteAccountSectionProps> = ({ isDeleting, onDelete }) => (
  <Card size="small">
    <Flex align="center" justify="space-between" gap={12} wrap>
      <Text type="secondary">
        Видалення акаунта не можна скасувати: після цього ви вийдете із системи.
      </Text>
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
    </Flex>
  </Card>
);

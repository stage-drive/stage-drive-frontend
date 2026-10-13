import type { FC } from 'react';
import { Avatar, Button, Card, Flex, Space, Tag, Typography, Upload, theme } from 'antd';
import type { UploadProps } from 'antd';
import { DeleteOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import type { UserRole } from '@/store/api/types';
import { resolveMediaUrl } from '@/shared/utils/resolveMediaUrl';

const { Text, Title } = Typography;

const ROLE_LABEL: Record<UserRole, string> = {
  OWNER: 'Власник',
  ADMIN: 'Адміністратор',
  TEACHER: 'Викладач',
  INSTRUCTOR: 'Інструктор',
  STUDENT: 'Учень',
};

const STATUS_TAG = {
  ACTIVE: { color: 'success', label: 'Активний' },
  INVITED: { color: 'processing', label: 'Запрошений' },
  BLOCKED: { color: 'error', label: 'Заблокований' },
  ARCHIVED: { color: 'default', label: 'Архів' },
} as const;

interface ProfileAvatarProps {
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  status?: string | null;
  avatarUrl?: string | null;
  isUploading: boolean;
  isDeleting: boolean;
  onUpload: UploadProps['onChange'];
  onDelete: () => void;
}

export const ProfileAvatar: FC<ProfileAvatarProps> = ({
  firstName,
  lastName,
  email,
  role,
  status,
  avatarUrl,
  isUploading,
  isDeleting,
  onUpload,
  onDelete,
}) => {
  const { token } = theme.useToken();
  const accountStatus = status ? STATUS_TAG[status as keyof typeof STATUS_TAG] : undefined;

  return (
    <Card variant="borderless" style={{ background: token.colorFillAlter }}>
      <Flex align="center" gap={20} wrap>
        <Avatar
          size={96}
          src={resolveMediaUrl(avatarUrl)}
          icon={<UserOutlined />}
          style={{ backgroundColor: token.colorPrimary, flex: 'none' }}
        />
        <Flex vertical gap={8} style={{ minWidth: 0 }}>
          <Title level={4} style={{ margin: 0 }}>
            {firstName} {lastName}
          </Title>
          <Text type="secondary">{email}</Text>
          <Space wrap size={8}>
            <Tag color="blue">{ROLE_LABEL[role] ?? role}</Tag>
            {accountStatus ? (
              <Tag color={accountStatus.color}>{accountStatus.label}</Tag>
            ) : null}
          </Space>
          <Space wrap>
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={onUpload}
            >
              <Button icon={<UploadOutlined />} loading={isUploading}>
                Завантажити фото
              </Button>
            </Upload>
            {avatarUrl ? (
              <Button icon={<DeleteOutlined />} danger loading={isDeleting} onClick={onDelete}>
                Видалити фото
              </Button>
            ) : null}
          </Space>
        </Flex>
      </Flex>
    </Card>
  );
};

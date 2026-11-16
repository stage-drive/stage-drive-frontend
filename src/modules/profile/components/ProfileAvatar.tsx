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
    <Card
      size="small"
      variant="borderless"
      style={{ background: token.colorFillAlter }}
      styles={{ body: { padding: '10px 14px' } }}
    >
      <Flex align="center" gap={12} wrap>
        <Avatar
          size={64}
          src={resolveMediaUrl(avatarUrl)}
          icon={<UserOutlined />}
          style={{ backgroundColor: token.colorPrimary, flex: 'none' }}
        />
        <Flex vertical gap={2} style={{ minWidth: 0, flex: 1 }}>
          <Flex align="center" gap={8} wrap>
            <Title level={5} style={{ margin: 0 }}>
              {firstName} {lastName}
            </Title>
            <Tag color="blue" style={{ marginInlineEnd: 0 }}>
              {ROLE_LABEL[role] ?? role}
            </Tag>
            {accountStatus ? (
              <Tag color={accountStatus.color} style={{ marginInlineEnd: 0 }}>
                {accountStatus.label}
              </Tag>
            ) : null}
          </Flex>
          <Text type="secondary" ellipsis>
            {email}
          </Text>
        </Flex>
        <Space size={8} wrap>
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
    </Card>
  );
};

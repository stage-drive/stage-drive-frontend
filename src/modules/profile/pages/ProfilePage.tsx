import React, { useEffect } from 'react';
import {
  Alert,
  App,
  Avatar,
  Button,
  Divider,
  Flex,
  Form,
  Input,
  Popconfirm,
  Space,
  Spin,
  Typography,
  Upload,
} from 'antd';
import type { UploadProps } from 'antd';
import { DeleteOutlined, LockOutlined, UploadOutlined, UserOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  useChangeMyPasswordMutation,
  useDeleteMeMutation,
  useDeleteMyAvatarMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useUploadMyAvatarMutation,
  type UpdateProfileRequest,
} from '../../../store/api/endpoints/authApi';
import { baseApi } from '../../../store/api/baseApi';
import { PhoneInput } from '../../../shared/components/PhoneInput';
import {
  formatUkrainianPhone,
  normalizeUkrainianPhone,
  validateUkrainianPhone,
} from '../../../shared/utils/ukrainianPhone';

const { Title, Paragraph, Text } = Typography;

interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ApiError {
  data?: {
    message?: string | string[];
  };
}

const getErrorMessage = (error: unknown, fallback: string) => {
  const message = (error as ApiError).data?.message;
  return Array.isArray(message) ? message.join(', ') : message || fallback;
};

export const ProfilePage: React.FC = () => {
  const [profileForm] = Form.useForm<UpdateProfileRequest>();
  const [passwordForm] = Form.useForm<PasswordFormValues>();
  const { data: user, isLoading, isError } = useGetMeQuery();
  const [updateMe, { isLoading: isSavingProfile }] = useUpdateMeMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadMyAvatarMutation();
  const [deleteAvatar, { isLoading: isDeletingAvatar }] = useDeleteMyAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangeMyPasswordMutation();
  const [deleteMe, { isLoading: isDeletingAccount }] = useDeleteMeMutation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        phone: formatUkrainianPhone(user.phone),
      });
    }
  }, [profileForm, user]);

  const onSaveProfile = async (values: UpdateProfileRequest) => {
    try {
      await updateMe({
        firstName: values.firstName?.trim(),
        lastName: values.lastName?.trim(),
        phone: normalizeUkrainianPhone(values.phone),
      }).unwrap();
      message.success('Профіль оновлено');
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Не вдалося оновити профіль'));
    }
  };

  const onUploadAvatar: UploadProps['onChange'] = ({ file }) => {
    const imageFile = file.originFileObj;
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('file', imageFile);
    void uploadAvatar(formData)
      .unwrap()
      .then(() => message.success('Фото профілю оновлено'))
      .catch((error: unknown) =>
        message.error(getErrorMessage(error, 'Не вдалося завантажити фото'))
      );
  };

  const onDeleteAvatar = async () => {
    try {
      await deleteAvatar().unwrap();
      message.success('Фото профілю видалено');
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Не вдалося видалити фото'));
    }
  };

  const onChangePassword = async (values: PasswordFormValues) => {
    try {
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      message.success(response.message || 'Пароль змінено');
      passwordForm.resetFields();
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Не вдалося змінити пароль'));
    }
  };

  const onDeleteAccount = async () => {
    try {
      await deleteMe().unwrap();
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch(baseApi.util.resetApiState());
      window.dispatchEvent(new Event('auth-change'));
      navigate('/login', { replace: true });
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Не вдалося видалити акаунт'));
    }
  };

  if (isLoading) {
    return (
      <Flex justify="center" style={{ padding: 48 }}>
        <Spin size="large" />
      </Flex>
    );
  }

  if (isError || !user) {
    return <Alert type="error" showIcon message="Не вдалося завантажити профіль" />;
  }

  return (
    <section style={{ maxWidth: 760 }}>
      <Title level={2}>Профіль</Title>

      <Flex align="center" gap={20} wrap style={{ margin: '24px 0' }}>
        <Avatar size={88} src={user.avatarUrl} icon={<UserOutlined />} />
        <Flex vertical gap={8}>
          <Text strong>
            {user.firstName} {user.lastName}
          </Text>
          <Text type="secondary">{user.email}</Text>
          <Space wrap>
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={onUploadAvatar}
            >
              <Button icon={<UploadOutlined />} loading={isUploadingAvatar}>
                Завантажити фото
              </Button>
            </Upload>
            {user.avatarUrl && (
              <Button
                icon={<DeleteOutlined />}
                danger
                loading={isDeletingAvatar}
                onClick={() => void onDeleteAvatar()}
              >
                Видалити фото
              </Button>
            )}
          </Space>
        </Flex>
      </Flex>

      <Divider />

      <Title level={4}>Особисті дані</Title>
      <Paragraph type="secondary">
        Email змінити поки неможливо: відповідні API endpoints ще не реалізовані на сервері.
      </Paragraph>
      <Form form={profileForm} layout="vertical" onFinish={onSaveProfile} style={{ maxWidth: 480 }}>
        <Form.Item
          label="Ім'я"
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
        <Form.Item label="Телефон" name="phone" rules={[{ validator: validateUkrainianPhone }]}>
          <PhoneInput />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isSavingProfile}>
          Зберегти зміни
        </Button>
      </Form>

      <Divider />

      <Title level={4}>Зміна пароля</Title>
      <Form
        form={passwordForm}
        layout="vertical"
        onFinish={onChangePassword}
        style={{ maxWidth: 480 }}
      >
        <Form.Item
          label="Поточний пароль"
          name="currentPassword"
          rules={[{ required: true, message: 'Введіть поточний пароль' }]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
        </Form.Item>
        <Form.Item
          label="Новий пароль"
          name="newPassword"
          rules={[
            {
              required: true,
              message: 'Введіть пароль',
            },
            {
              min: 8,
              message: 'Пароль має містити щонайменше 8 символів',
            },
            {
              pattern: /[A-ZА-ЯІЇЄҐ]/,
              message: 'Пароль має містити хоча б одну велику літеру',
            },
            {
              pattern: /[a-zа-яіїєґ]/,
              message: 'Пароль має містити хоча б одну малу літеру',
            },
            {
              pattern: /\d/,
              message: 'Пароль має містити хоча б одну цифру',
            },
            {
              pattern: /[^A-Za-zА-Яа-яІіЇїЄєҐґ0-9]/,
              message: 'Пароль має містити хоча б один спеціальний символ',
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="Підтвердження нового пароля"
          name="confirmPassword"
          dependencies={['newPassword']}
          rules={[
            { required: true, message: 'Підтвердьте новий пароль' },
            ({ getFieldValue }) => ({
              validator(_, value: string | undefined) {
                if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
                return Promise.reject(new Error('Паролі не збігаються'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
        </Form.Item>
        <Button type="primary" htmlType="submit" loading={isChangingPassword}>
          Змінити пароль
        </Button>
      </Form>

      <Divider />

      <Title level={4}>Видалення акаунта</Title>
      <Paragraph type="secondary">
        Після видалення ви вийдете із системи. Цю дію не можна скасувати.
      </Paragraph>
      <Popconfirm
        title="Видалити акаунт?"
        description="Ви втратите доступ до профілю та даних акаунта."
        okText="Видалити акаунт"
        cancelText="Скасувати"
        okButtonProps={{ danger: true, loading: isDeletingAccount }}
        onConfirm={() => void onDeleteAccount()}
      >
        <Button danger icon={<DeleteOutlined />} loading={isDeletingAccount}>
          Видалити акаунт
        </Button>
      </Popconfirm>
    </section>
  );
};

export default ProfilePage;

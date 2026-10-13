import { useEffect, useState } from 'react';
import {
  Alert,
  App,
  Avatar,
  Button,
  Card,
  Flex,
  Form,
  Input,
  Popconfirm,
  Skeleton,
  Typography,
  Upload,
  theme,
} from 'antd';
import type { UploadProps } from 'antd';
import { BankOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  useDeleteOrganizationMutation,
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
} from '@/store/api/endpoints/organizationApi';
import { baseApi } from '@/store/api/baseApi';
import { resolveMediaUrl } from '@/shared/utils/resolveMediaUrl';

const { Title, Text } = Typography;

interface ApiError {
  data?: {
    message?: string | string[];
  };
}

const getErrorMessage = (error: unknown, fallback: string) => {
  const message = (error as ApiError).data?.message;
  return Array.isArray(message) ? message.join(', ') : message || fallback;
};

export const SchoolSettingsPage = () => {
  const { token } = theme.useToken();
  const [form] = Form.useForm<{ name: string }>();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>();
  const { data: organization, isLoading, isError } = useGetOrganizationQuery();
  const [updateOrganization, { isLoading: isSaving }] = useUpdateOrganizationMutation();
  const [deleteOrganization, { isLoading: isDeleting }] = useDeleteOrganizationMutation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (organization) {
      form.setFieldsValue({ name: organization.name });
    }
  }, [form, organization]);

  useEffect(() => {
    if (!logoFile) {
      setLogoPreview(undefined);
      return undefined;
    }

    const previewUrl = URL.createObjectURL(logoFile);
    setLogoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [logoFile]);

  const onSelectLogo: UploadProps['onChange'] = ({ file }) => {
    const imageFile = file.originFileObj ?? (file instanceof File ? file : undefined);
    if (imageFile) setLogoFile(imageFile);
  };

  const onSave = async (values: { name: string }) => {
    const formData = new FormData();
    formData.append('name', values.name.trim());
    if (logoFile) formData.append('logo', logoFile);

    try {
      await updateOrganization(formData).unwrap();
      setLogoFile(null);
      message.success('Дані автошколи збережено');
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Не вдалося зберегти дані автошколи'));
    }
  };

  const onDelete = async () => {
    try {
      await deleteOrganization().unwrap();
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch(baseApi.util.resetApiState());
      window.dispatchEvent(new Event('auth-change'));
      navigate('/login', { replace: true });
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Не вдалося видалити автошколу'));
    }
  };

  if (isLoading) {
    return (
      <Card style={{ maxWidth: 760 }}>
        <Skeleton avatar active paragraph={{ rows: 3 }} />
      </Card>
    );
  }

  if (isError || !organization) {
    return <Alert type="error" showIcon title="Не вдалося завантажити дані автошколи" />;
  }

  const logoSrc = logoPreview ?? resolveMediaUrl(organization.logoUrl);

  return (
    <Flex vertical gap={24} style={{ maxWidth: 760 }}>
      <Flex vertical gap={4}>
        <Title level={3} style={{ margin: 0 }}>
          Автошкола
        </Title>
        <Text type="secondary">Назва і логотип школи</Text>
      </Flex>

      <Card variant="borderless" style={{ background: token.colorFillAlter }}>
        <Flex align="center" gap={20} wrap>
          <Avatar
            size={96}
            src={logoSrc}
            icon={<BankOutlined />}
            style={{ backgroundColor: token.colorPrimary, flex: 'none' }}
          />
          <Flex vertical gap={8}>
            <Text strong>{organization.name}</Text>
            <Text type="secondary">Часовий пояс: {organization.timezone}</Text>
            <Upload
              accept="image/*"
              showUploadList={false}
              beforeUpload={() => false}
              onChange={onSelectLogo}
            >
              <Button icon={<UploadOutlined />}>
                {logoFile ? 'Логотип обрано' : 'Завантажити логотип'}
              </Button>
            </Upload>
          </Flex>
        </Flex>
      </Card>

      <Card title="Дані автошколи">
        <Form form={form} layout="vertical" onFinish={onSave}>
          <Form.Item
            label="Назва"
            name="name"
            rules={[{ required: true, whitespace: true, message: 'Введіть назву автошколи' }]}
          >
            <Input />
          </Form.Item>
          <Button type="primary" htmlType="submit" loading={isSaving}>
            Зберегти зміни
          </Button>
        </Form>
      </Card>

      <Card title="Видалення автошколи">
        <Alert
          type="warning"
          showIcon
          style={{ marginBottom: 16 }}
          title="Школу, користувачів і дані буде видалено. Цю дію не можна скасувати."
        />
        <Popconfirm
          title="Видалити автошколу?"
          description="Після видалення ви вийдете із системи."
          okText="Видалити автошколу"
          cancelText="Скасувати"
          okButtonProps={{ danger: true, loading: isDeleting }}
          onConfirm={() => void onDelete()}
        >
          <Button danger icon={<DeleteOutlined />} loading={isDeleting}>
            Видалити автошколу
          </Button>
        </Popconfirm>
      </Card>
    </Flex>
  );
};

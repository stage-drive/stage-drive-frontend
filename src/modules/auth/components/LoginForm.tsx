import { App, Button, Divider, Flex, Form, Input, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined, LockOutlined } from '@ant-design/icons';
import { useLoginMutation, type LoginRequest } from '@/store/api/endpoints/authApi';
import { AuthSplitLayout } from '@/modules/auth/components/AuthSplitLayout';
import { GoogleLoginButton } from '@/modules/auth/components/GoogleLoginButton';

const { Title, Paragraph } = Typography;

export const LoginForm = () => {
  const [form] = Form.useForm<LoginRequest>();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { message } = App.useApp();

  
const onFinish = async (values: LoginRequest) => {
  try {
    const response = await login(values).unwrap();

    localStorage.setItem('token', response.accessToken);

    if (response.refreshToken) {
      localStorage.setItem('refreshToken', response.refreshToken);
    } else {
      localStorage.removeItem('refreshToken');
    }

    window.dispatchEvent(new Event('auth-change'));
    message.success('Успішний вхід!');
    navigate('/', { replace: true });
  } catch (err: unknown) {
    const error = err as {
      status?: number | string;
      data?: {
        message?: string | string[];
        detail?: string;
      };
    };

    const rawMessage = error.data?.message ?? error.data?.detail;

    let userFriendlyMessage = 'Не вдалося увійти. Спробуйте ще раз.';

    if (error.status === 401) {
      userFriendlyMessage = 'Невірний email або пароль';
    } else if (error.status === 403) {
      userFriendlyMessage =
        typeof rawMessage === 'string'
          ? rawMessage
          : 'Доступ обмежено. Зверніться до адміністратора за інвайтом.';
    } else if (Array.isArray(rawMessage)) {
      userFriendlyMessage = rawMessage.join(', ');
    } else if (typeof rawMessage === 'string') {
      userFriendlyMessage = rawMessage;
    }

    message.error(userFriendlyMessage);
  }
};


  return (
    <AuthSplitLayout
      imageSrc="/images/login-bg.jpg"
      heroTitle="Ласкаво просимо!"
      heroDescription="Увійдіть у свій акаунт, щоб продовжити навчання або керування автошколою. Ми раді бачити вас знову!"
      contentMaxWidth={350}
      contentPadding="28px 48px"
    >
      <Flex vertical style={{ marginBottom: 20 }}>
        <Title
          level={2}
          style={{ margin: '0 0 6px', fontSize: 28, lineHeight: 1.2, fontWeight: 600 }}
        >
          Увійти до автошколи
        </Title>
        <Paragraph style={{ margin: 0, color: '#8c8c8c', fontSize: 14, lineHeight: 1.5 }}>
          Увійдіть до вашої автошколи
        </Paragraph>
      </Flex>

      <Form form={form} name="login" layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Email"
          name="email"
          rules={[
            {
              required: true,
              message: 'Введіть email',
            },
            {
              type: 'email',
              message: 'Введіть коректний Email',
            },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="user@example.com" autoComplete="email" />
        </Form.Item>

        <Form.Item
          label="Пароль"
          name="password"
          rules={[{ required: true, message: 'Введіть пароль' }]}
        >
          <Input.Password
            prefix={<LockOutlined />}
            placeholder="Пароль"
            autoComplete="current-password"
          />
        </Form.Item>

        <Flex justify="flex-end" style={{ marginBottom: 16 }}>
          <Link to="/forgot-password">Забули пароль?</Link>
        </Flex>

        <Form.Item style={{ marginBottom: 12 }}>
          <Button type="primary" htmlType="submit" loading={isLoading} block>
            Увійти
          </Button>
        </Form.Item>

        <Divider style={{ margin: '24px 0', color: '#8c8c8c' }}>або</Divider>

        <GoogleLoginButton />
      </Form>
    </AuthSplitLayout>
  );
};

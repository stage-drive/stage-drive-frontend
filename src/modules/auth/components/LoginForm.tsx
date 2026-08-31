import React from 'react';
import { Form, Input, Button, App, Divider } from 'antd';
import { GoogleOutlined } from '@ant-design/icons';
import { useNavigate, Link } from 'react-router-dom';
import { useLoginMutation, type LoginRequest } from '../../../store/api/endpoints/authApi';

export const LoginForm: React.FC = () => {
  console.log(window.location.href);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const { message } = App.useApp();

  const onFinish = async (values: LoginRequest) => {
    try {
      const response = await login(values).unwrap();

      localStorage.setItem('token', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      window.dispatchEvent(new Event('auth-change'));
      message.success('Успішний вхід!');
      navigate('/', { replace: true });
    } catch (err: any) {
      const rawMessage = err?.data?.message;

      let userFriendlyMessage = 'Невірний email або пароль';

      if (rawMessage === 'Invalid credentials') {
        userFriendlyMessage = 'Невірний email або пароль';
      } else if (rawMessage === 'User not found') {
        userFriendlyMessage = 'Користувача з таким email не знайдено';
      } else if (Array.isArray(rawMessage)) {
        userFriendlyMessage = rawMessage.join(', ');
      }

      message.error(userFriendlyMessage);
    }
  };

  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || '/api';
    const cleanUrl = backendUrl.replace(/\/+$/, '');

    window.location.href = `${cleanUrl}/auth/google`;
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, type: 'email', message: 'Введіть email' }]}
      >
        <Input placeholder="user@example.com" />
      </Form.Item>

      <Form.Item
        label="Пароль"
        name="password"
        rules={[{ required: true, message: 'Введіть пароль' }]}
      >
        <Input.Password placeholder="Ваш пароль" />
      </Form.Item>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 16 }}>
        <Link to="/forgot-password" style={{ fontSize: '14px' }}>
          Забули пароль?
        </Link>
      </div>

      <Form.Item style={{ marginBottom: 12 }}>
        <Button type="primary" htmlType="submit" loading={isLoading} block>
          Увійти
        </Button>
      </Form.Item>

      <Divider style={{ margin: '16px 0', fontSize: '14px', color: '#8c8c8c' }}>або</Divider>

      <Button icon={<GoogleOutlined />} block onClick={handleGoogleLogin}>
        Увійти через Google
      </Button>
    </Form>
  );
};

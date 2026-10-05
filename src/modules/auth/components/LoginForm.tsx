import React from 'react';
import { App, Button, Col, Divider, Flex, Form, Input, Row, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { MailOutlined, LockOutlined  } from '@ant-design/icons';
import { useLoginMutation, type LoginRequest } from '../../../store/api/endpoints/authApi';
import { GoogleLoginButton } from './GoogleLoginButton';

const { Title, Paragraph } = Typography;

export const LoginForm: React.FC = () => {
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
      }

      window.dispatchEvent(new Event('auth-change'));
      message.success('Успішний вхід!');
      navigate('/', { replace: true });
    } catch (err: unknown) {
      const rawMessage = (err as { data?: { message?: string | string[] } }).data?.message;
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

  return (
    <Flex
      align="center"
      justify="center"
      style={{ width: '100%', height: '100vh', boxSizing: 'border-box', overflow: 'hidden' }}
    >
      <Row
        align="stretch"
        style={{
          width: '100%',
          maxWidth: 1200,
          height: 'min(calc(100vh - 48px), 760px)',
          overflow: 'hidden',
          borderRadius: 16,
          background: '#fff',
          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.08)',
        }}
      >
        <Col xs={0} md={12} style={{ position: 'relative', overflow: 'hidden' }}>
          <img
            src="/images/login-bg.jpg"
            alt="Автошкола"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              inset: 0,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.75) 100%)',
            }}
          />
          <Flex
            vertical
            justify="space-between"
            style={{
              position: 'relative',
              zIndex: 1,
              height: '100%',
              boxSizing: 'border-box',
              padding: 40,
            }}
          >
            <img src="/images/logofull.png" alt="Advance" style={{ width: 140, height: 'auto' }} />
            <Flex vertical>
              <Title
                level={1}
                style={{ margin: '0 0 16px', color: '#fff', fontSize: 40, lineHeight: 1.15 }}
              >
                Ласкаво просимо!
              </Title>
              <Paragraph
                style={{ maxWidth: 400, margin: 0, color: '#fff', fontSize: 16, lineHeight: 1.5 }}
              >
                Увійдіть у свій акаунт, щоб продовжити навчання або керування автошколою. Ми раді
                бачити вас знову!
              </Paragraph>
            </Flex>
          </Flex>
        </Col>

        <Col
          xs={24}
          md={12}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '28px 48px',
          }}
        >
          <Flex vertical style={{ width: '100%', maxWidth: 350 }}>
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
                    message: 'Будь ласка, введіть Email',
                  },
                  {
                    type: 'email',
                    message: 'Введіть коректний Email',
                  },
                ]}
              >
                <Input prefix={<MailOutlined />}placeholder="user@example.com" autoComplete="email" />
              </Form.Item>

              <Form.Item
                label="Пароль"
                name="password"
                rules={[{ required: true, message: 'Введіть пароль' }]}
              >
                <Input.Password prefix={<LockOutlined />} placeholder="Пароль" autoComplete="current-password" />
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
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
};

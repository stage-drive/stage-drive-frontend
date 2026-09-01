import React from 'react';
import { Form, Input, Button, Checkbox, Card, App } from 'antd';
import { useNavigate } from 'react-router-dom';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  PhoneOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useRegisterMutation, type RegisterRequest } from '../../../store/api/endpoints/authApi';

export const RegisterForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [register, { isLoading }] = useRegisterMutation();

  const onFinish = async (values: RegisterRequest) => {
    try {
      const response = await register(values).unwrap();
      localStorage.setItem('token', response.accessToken);
      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      window.dispatchEvent(new Event('auth-change'));

      message.success('Реєстрація успішна!');

      navigate('/', { replace: true });
    } catch (err: unknown) {
      const apiMessage = (err as { data?: { message?: string } }).data?.message;
      message.error(apiMessage || 'Помилка реєстрації');
    }
  };

  return (
    <Card title="Реєстрація автошколи" style={{ maxWidth: 480, margin: '40px auto' }}>
      <Form form={form} name="register" onFinish={onFinish} layout="vertical" scrollToFirstError>
        <Form.Item
          name="organizationName"
          label="Назва автошколи"
          rules={[{ required: true, message: 'Будь ласка, введіть назву автошколи' }]}
        >
          <Input prefix={<BankOutlined />} placeholder="Автошкола «Драйв»" />
        </Form.Item>

        <Form.Item
          name="firstName"
          label="Ім'я"
          rules={[{ required: true, message: "Будь ласка, введіть ім'я" }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Олександр" />
        </Form.Item>

        <Form.Item
          name="lastName"
          label="Прізвище"
          rules={[{ required: true, message: 'Будь ласка, введіть прізвище' }]}
        >
          <Input prefix={<UserOutlined />} placeholder="Шевченко" />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { type: 'email', message: 'Введіть коректний Email' },
            { required: true, message: 'Будь ласка, введіть Email' },
          ]}
        >
          <Input prefix={<MailOutlined />} placeholder="example@autoschool.com" />
        </Form.Item>

        <Form.Item name="phone" label="Номер телефону (необов'язково)">
          <Input prefix={<PhoneOutlined />} placeholder="+380XXXXXXXXX" />
        </Form.Item>

        <Form.Item
          name="password"
          label="Пароль"
          rules={[
            { required: true, message: 'Введіть пароль' },
            { min: 8, message: 'Пароль повинен містити щонайменше 8 символів' },
          ]}
          hasFeedback
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
        </Form.Item>

        <Form.Item
          name="passwordConfirmation"
          label="Підтвердження пароля"
          dependencies={['password']}
          hasFeedback
          rules={[
            { required: true, message: 'Підтвердьте пароль' },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Паролі не збігаються!'));
              },
            }),
          ]}
        >
          <Input.Password prefix={<LockOutlined />} placeholder="Повторіть пароль" />
        </Form.Item>

        <Form.Item
          name="termsAccepted"
          valuePropName="checked"
          rules={[
            {
              validator: (_, value) =>
                value
                  ? Promise.resolve()
                  : Promise.reject(new Error('Необхідно погодитися з умовами використання')),
            },
          ]}
        >
          <Checkbox>
            Я погоджуюся з{' '}
            <a href="/terms" target="_blank" rel="noreferrer">
              умовами використання
            </a>
          </Checkbox>
        </Form.Item>

        <Form.Item style={{ marginBottom: 0 }}>
          <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
            Зареєструватися
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

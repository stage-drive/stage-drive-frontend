import React from 'react';
import { App, Button, Checkbox, Col, Flex, Form, Input, Row, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';
import { useRegisterMutation, type RegisterRequest } from '../../../store/api/endpoints/authApi';
import { PhoneInput } from '../../../shared/components/PhoneInput';
import {
  normalizeUkrainianPhone,
  validateUkrainianPhone,
} from '../../../shared/utils/ukrainianPhone';

const { Title, Paragraph, Text } = Typography;

export const RegisterForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [register, { isLoading }] = useRegisterMutation();

  const onFinish = async (values: RegisterRequest) => {
    try {
      const response = await register({
        ...values,
        phone: normalizeUkrainianPhone(values.phone),
      }).unwrap();

      localStorage.setItem('token', response.accessToken);

      if (response.refreshToken) {
        localStorage.setItem('refreshToken', response.refreshToken);
      }

      window.dispatchEvent(new Event('auth-change'));

      message.success('Реєстрація успішна!');

      navigate('/', { replace: true });
    } catch (err: unknown) {
      const apiMessage = (
        err as {
          data?: {
            message?: string;
          };
        }
      ).data?.message;

      message.error(apiMessage || 'Помилка реєстрації');
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
            src="/images/register.jpg"
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
              padding: 40,
              boxSizing: 'border-box',
            }}
          >
            {/* LOGO */}

            <img src="/images/logofull.png" alt="Advance" style={{ width: 140, height: 'auto' }} />

            {/* TEXT */}

            <Flex vertical>
              <Title
                level={1}
                style={{ margin: '0 0 16px', color: '#fff', fontSize: 40, lineHeight: 1.15 }}
              >
                Керуйте автошколою
                <br />в одному місці
              </Title>

              <Paragraph
                style={{
                  maxWidth: 400,
                  margin: 0,
                  color: 'rgba(255,255,255,0.9)',
                  fontSize: 16,
                  lineHeight: 1.5,
                }}
              >
                CRM та LMS система для організації навчання, студентів, викладачів та розкладу.
              </Paragraph>
            </Flex>
          </Flex>
        </Col>

        {/* RIGHT SIDE */}

        <Col
          xs={24}
          md={12}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '28px clamp(20px, 4vw, 48px)',
          }}
        >
          <Flex vertical style={{ width: '100%', maxWidth: 500 }}>
            {/* HEADER */}

            <Flex vertical style={{ marginBottom: 20 }}>
              <Title
                level={2}
                style={{ margin: '0 0 6px', fontSize: 28, lineHeight: 1.2, fontWeight: 600 }}
              >
                Реєстрація автошколи
              </Title>

              <Paragraph style={{ margin: 0, color: '#8c8c8c', fontSize: 14, lineHeight: 1.5 }}>
                Створіть автошколу та почніть працювати з системою
              </Paragraph>
            </Flex>

            {/* FORM */}

            <Form
              form={form}
              name="register"
              onFinish={onFinish}
              layout="vertical"
              scrollToFirstError
              requiredMark={false}
            >
              {/* SCHOOL */}

              <Form.Item
                name="organizationName"
                label="Назва автошколи"
                style={{ marginBottom: 12 }}
                rules={[
                  {
                    required: true,
                    message: 'Будь ласка, введіть назву автошколи',
                  },
                ]}
              >
                <Input prefix={<BankOutlined />} placeholder="Автошкола «Драйв»" />
              </Form.Item>

              {/* FIRST NAME + LAST NAME */}

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="firstName"
                    label="Ім'я"
                    style={{ marginBottom: 12 }}
                    rules={[
                      {
                        required: true,
                        message: "Будь ласка, введіть ім'я",
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Олександр" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="lastName"
                    label="Прізвище"
                    style={{ marginBottom: 12 }}
                    rules={[
                      {
                        required: true,
                        message: 'Будь ласка, введіть прізвище',
                      },
                    ]}
                  >
                    <Input prefix={<UserOutlined />} placeholder="Шевченко" />
                  </Form.Item>
                </Col>
              </Row>

              {/* EMAIL */}

              <Form.Item
                name="email"
                label="Email"
                style={{ marginBottom: 12 }}
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
                <Input prefix={<MailOutlined />} placeholder="example@autoschool.com" />
              </Form.Item>

              {/* PHONE */}

              <Form.Item
                name="phone"
                label="Номер телефону (необов'язково)"
                style={{ marginBottom: 12 }}
                rules={[{ validator: validateUkrainianPhone }]}
              >
                <PhoneInput />
              </Form.Item>

              {/* PASSWORD + CONFIRM PASSWORD */}

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item
                    name="password"
                    label="Пароль"
                    style={{ marginBottom: 12 }}
                    hasFeedback
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
                    <Input.Password prefix={<LockOutlined />} placeholder="Пароль" />
                  </Form.Item>
                </Col>

                <Col xs={24} sm={12}>
                  <Form.Item
                    name="passwordConfirmation"
                    label="Підтвердження пароля"
                    dependencies={['password']}
                    style={{ marginBottom: 12 }}
                    hasFeedback
                    rules={[
                      {
                        required: true,
                        message: 'Підтвердьте пароль',
                      },
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
                </Col>
              </Row>

              {/* TERMS */}

              <Form.Item
                name="termsAccepted"
                valuePropName="checked"
                style={{ marginBottom: 16 }}
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
                  <Typography.Link href="/terms" target="_blank" rel="noreferrer">
                    умовами використання
                  </Typography.Link>
                </Checkbox>
              </Form.Item>

              {/* SUBMIT */}

              <Button type="primary" htmlType="submit" loading={isLoading} block size="large">
                Зареєструватися
              </Button>

              {/* LOGIN */}

              <Flex justify="center" style={{ marginTop: 16 }}>
                <Text type="secondary" style={{ marginRight: 16 }}>
                  Вже маєте акаунт?{' '}
                </Text>
                <Link to="/login">Увійти</Link>
              </Flex>
            </Form>
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
};

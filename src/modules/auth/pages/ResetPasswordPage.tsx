import React, { useState } from 'react';
import { App, Button, Col, Flex, Form, Input, Result, Row, Typography, type FormRule } from 'antd';
import {
  ArrowLeftOutlined,
  EyeInvisibleOutlined,
  EyeOutlined,
  LockOutlined,
} from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import {
  useResetPasswordMutation,
  type ResetPasswordRequest,
} from '../../../store/api/endpoints/authApi';

const { Title, Paragraph } = Typography;

interface PasswordFieldProps {
  name: 'password' | 'passwordConfirmation';
  label: string;
  placeholder: string;
  rules: FormRule[];
}

const PasswordField: React.FC<PasswordFieldProps> = ({ name, label, placeholder, rules }) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  return (
    <Form.Item label={label} name={name} rules={rules}>
      <Input
        type={isPasswordVisible ? 'text' : 'password'}
        prefix={<LockOutlined />}
        placeholder={placeholder}
        autoComplete="new-password"
        suffix={
          <Button
            type="text"
            icon={isPasswordVisible ? <EyeInvisibleOutlined /> : <EyeOutlined />}
            aria-label={isPasswordVisible ? 'Приховати пароль' : 'Показати пароль'}
            onClick={() => setIsPasswordVisible((prev) => !prev)}
            style={{
              border: 'none',
              boxShadow: 'none',
              width: 24,
              minWidth: 24,
              height: 24,
              padding: 0,
            }}
          />
        }
      />
    </Form.Item>
  );
};

interface ApiError {
  status?: number | string;
  data?: {
    message?: string;
  };
}

const getErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'Не вдалося змінити пароль. Спробуйте ще раз.';
  }

  const apiError = error as ApiError;

  if (apiError.status === 400) {
    return 'Посилання недійсне або пароль не відповідає вимогам.';
  }

  if (apiError.status === 401) {
    return 'Токен для відновлення пароля недійсний або прострочений.';
  }

  if (apiError.data?.message) {
    return apiError.data.message;
  }

  return 'Не вдалося змінити пароль. Спробуйте ще раз.';
};

export const ResetPasswordPage: React.FC = () => {
  const [form] = Form.useForm<Pick<ResetPasswordRequest, 'password' | 'passwordConfirmation'>>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const token = searchParams.get('token') ?? '';
  const [resetPassword, { isLoading }] = useResetPasswordMutation();

  const onFinish = async (
    values: Pick<ResetPasswordRequest, 'password' | 'passwordConfirmation'>
  ) => {
    if (!token) {
      message.error('Посилання для відновлення пароля недійсне.');
      return;
    }

    try {
      await resetPassword({
        token,
        ...values,
      }).unwrap();

      message.success('Пароль успішно змінено.');
      navigate('/login', { replace: true });
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
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
            src="/images/forgot-bg.jpg"
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
                Створіть новий пароль
              </Title>
              <Paragraph
                style={{ maxWidth: 420, margin: 0, color: '#fff', fontSize: 16, lineHeight: 1.5 }}
              >
                Введіть новий пароль для свого акаунта. Після підтвердження ви зможете увійти в
                систему з новими даними.
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
            padding: '28px clamp(20px, 4vw, 48px)',
          }}
        >
          <Flex vertical style={{ width: '100%', maxWidth: 380 }}>
            {!token ? (
              <Result
                status="error"
                title="Посилання недійсне"
                subTitle="У запиті відсутній токен для відновлення пароля."
                extra={
                  <Button type="primary" onClick={() => navigate('/forgot-password')}>
                    Повторити запит
                  </Button>
                }
              />
            ) : (
              <>
                <Flex vertical style={{ marginBottom: 20 }}>
                  <Title
                    level={2}
                    style={{ margin: '0 0 6px', fontSize: 28, lineHeight: 1.2, fontWeight: 600 }}
                  >
                    Встановити новий пароль
                  </Title>
                  <Paragraph style={{ margin: 0, color: '#8c8c8c', fontSize: 14, lineHeight: 1.5 }}>
                    Виберіть надійний пароль і підтвердіть його.
                  </Paragraph>
                </Flex>

                <Form form={form} name="reset-password" layout="vertical" onFinish={onFinish}>
                  <PasswordField
                    name="password"
                    label="Новий пароль"
                    placeholder="Введіть новий пароль"
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
                  />

                  <PasswordField
                    name="passwordConfirmation"
                    label="Підтвердження пароля"
                    placeholder="Повторіть новий пароль"
                    rules={[
                      { required: true, message: 'Підтвердіть пароль' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('Паролі не співпадають'));
                        },
                      }),
                    ]}
                  />

                  <Form.Item style={{ marginTop: 24, marginBottom: 24 }}>
                    <Button type="primary" htmlType="submit" loading={isLoading} block>
                      Змінити пароль
                    </Button>
                  </Form.Item>

                  <Flex justify="flex-start">
                    <Link to="/login">
                      <ArrowLeftOutlined /> Повернутися до входу
                    </Link>
                  </Flex>
                </Form>
              </>
            )}
          </Flex>
        </Col>
      </Row>
    </Flex>
  );
};

export default ResetPasswordPage;

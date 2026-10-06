import React from 'react';
import { App, Button, Col, Flex, Form, Input, Result, Row, Spin, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';

import {
  useActivateAccountMutation,
  useVerifyInvitationTokenQuery,
  type ActivateAccountRequest,
} from '../../../store/api/endpoints/invitationsApi';

const { Title, Paragraph, Text } = Typography;

interface ApiError {
  status?: number | string;
  data?: {
    message?: string;
    code?: string;
  };
  error?: string;
}

const getErrorMessage = (error: unknown): string => {
  if (!error || typeof error !== 'object') {
    return 'Не вдалося активувати акаунт. Спробуйте ще раз.';
  }

  const apiError = error as ApiError;

  if (apiError.status === 401) {
    return 'Посилання недійсне або термін його дії закінчився.';
  }

  if (apiError.status === 403) {
    return 'У вас немає дозволу активувати цей акаунт.';
  }

  if (apiError.status === 409) {
    return 'Цей акаунт уже активовано або запрошення вже використано.';
  }

  if (apiError.data?.message) {
    return apiError.data.message;
  }

  if (apiError.status === 'FETCH_ERROR' || apiError.status === 'TIMEOUT_ERROR') {
    return 'Не вдалося підключитися до сервера. Перевірте з’єднання та спробуйте ще раз.';
  }

  return 'Не вдалося активувати акаунт. Спробуйте ще раз.';
};

export const AcceptInvitationPage: React.FC = () => {
  const [form] = Form.useForm<Pick<ActivateAccountRequest, 'password' | 'passwordConfirmation'>>();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const token = searchParams.get('token') ?? '';

  const {
    data: invitation,
    error: verificationError,
    isLoading: isVerifying,
  } = useVerifyInvitationTokenQuery(
    { token },
    {
      skip: !token,
    }
  );

  const [activateAccount, { isLoading: isActivating }] = useActivateAccountMutation();

  const onFinish = async (
    values: Pick<ActivateAccountRequest, 'password' | 'passwordConfirmation'>
  ) => {
    try {
      await activateAccount({
        token,
        ...values,
      }).unwrap();

      message.success('Акаунт активовано. Тепер увійдіть у систему.');

      navigate('/login', {
        replace: true,
      });
    } catch (error: unknown) {
      message.error(getErrorMessage(error));
    }
  };

  const verificationApiError = verificationError as ApiError | undefined;

  const verificationErrorMessage =
    verificationApiError?.data?.message || 'Посилання недійсне або термін його дії закінчився.';

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
        {/* LEFT SIDE */}
        <Col
          xs={0}
          md={12}
          style={{
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <img
            src="/images/invite-bg.jpg"
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
            <img
              src="/images/logofull.png"
              alt="Advance"
              style={{
                width: 140,
                height: 'auto',
              }}
            />

            <Flex vertical>
              <Title
                level={1}
                style={{
                  margin: '0 0 16px',
                  color: '#fff',
                  fontSize: 36,
                }}
              >
                Ласкаво просимо!
              </Title>

              <Paragraph
                style={{
                  maxWidth: 380,
                  margin: 0,
                  color: '#fff',
                  lineHeight: 1.6,
                }}
              >
                Завершіть налаштування акаунта, щоб приєднатися до автошколи.
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
            padding: 24,
            background: '#fff',
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: 420,
            }}
          >
            {!token ? (
              <Result
                status="error"
                title="Посилання недійсне"
                subTitle="У посиланні відсутній токен запрошення."
                extra={
                  <Button type="primary" onClick={() => navigate('/login')}>
                    Перейти до входу
                  </Button>
                }
              />
            ) : isVerifying ? (
              <Flex
                vertical
                align="center"
                justify="center"
                gap={16}
                style={{
                  minHeight: 300,
                }}
              >
                <Spin size="large" />
                <Text>Перевіряємо запрошення...</Text>
              </Flex>
            ) : verificationError || !invitation?.valid ? (
              <Result
                status="error"
                title="Запрошення недійсне"
                subTitle={verificationErrorMessage}
                extra={
                  <Button type="primary" onClick={() => navigate('/login')}>
                    Перейти до входу
                  </Button>
                }
              />
            ) : (
              <>
                <Title
                  level={2}
                  style={{
                    marginBottom: 8,
                  }}
                >
                  Створіть пароль
                </Title>

                <Paragraph
                  type="secondary"
                  style={{
                    marginBottom: 8,
                  }}
                >
                  Завершіть активацію свого акаунта.
                </Paragraph>

                <Paragraph
                  type="secondary"
                  style={{
                    marginBottom: 24,
                  }}
                >
                  Email: <Text strong>{invitation.email}</Text>
                </Paragraph>

                <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={true}>
                  <Form.Item
                    label="Новий пароль"
                    name="password"
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
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Введіть пароль"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item
                    label="Підтвердіть пароль"
                    name="passwordConfirmation"
                    dependencies={['password']}
                    rules={[
                      {
                        required: true,
                        message: 'Підтвердіть пароль',
                      },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }

                          return Promise.reject(new Error('Паролі не збігаються'));
                        },
                      }),
                    ]}
                  >
                    <Input.Password
                      prefix={<LockOutlined />}
                      placeholder="Повторіть пароль"
                      size="large"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginTop: 24 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      size="large"
                      block
                      loading={isActivating}
                    >
                      Активувати акаунт
                    </Button>
                  </Form.Item>
                </Form>
              </>
            )}
          </div>
        </Col>
      </Row>
    </Flex>
  );
};

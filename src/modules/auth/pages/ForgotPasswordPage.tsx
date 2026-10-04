import React, { useState } from 'react';
import { App, Button, Col, Flex, Form, Input, Result, Row, Typography } from 'antd';
import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import {
  useForgotPasswordMutation,
  type ForgotPasswordRequest,
} from '../../../store/api/endpoints/authApi';

const { Title, Paragraph } = Typography;

export const ForgotPasswordPage: React.FC = () => {
  const [form] = Form.useForm<ForgotPasswordRequest>();
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const { message } = App.useApp();
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);

  const onFinish = async (values: ForgotPasswordRequest) => {
    try {
      await forgotPassword(values).unwrap();
      setSubmittedEmail(values.email);
    } catch (error: unknown) {
      const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
      message.error(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Не вдалося надіслати запит'
      );
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
                Повернемо доступ
              </Title>
              <Paragraph
                style={{ maxWidth: 400, margin: 0, color: '#fff', fontSize: 16, lineHeight: 1.5 }}
              >
                Вкажіть email, прив'язаний до акаунта, і ми надішлемо інструкції для відновлення
                пароля.
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
            {submittedEmail ? (
              <Result
                status="success"
                title="Перевірте пошту"
                subTitle={`Якщо акаунт з адресою ${submittedEmail} існує, на нього надійдуть інструкції для зміни пароля.`}
                extra={
                  <Button
                    type="primary"
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/login')}
                  >
                    Повернутися до входу
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
                    Забули пароль?
                  </Title>
                  <Paragraph style={{ margin: 0, color: '#8c8c8c', fontSize: 14, lineHeight: 1.5 }}>
                    Введіть email, щоб отримати посилання для відновлення.
                  </Paragraph>
                </Flex>

                <Form form={form} name="forgot-password" layout="vertical" onFinish={onFinish}>
                  <Form.Item
                    label="Email"
                    name="email"
                    rules={[
                      { required: true, message: 'Введіть email' },
                      { type: 'email', message: 'Введіть коректний email' },
                    ]}
                  >
                    <Input
                      prefix={<MailOutlined />}
                      placeholder="user@example.com"
                      autoComplete="email"
                    />
                  </Form.Item>

                  <Form.Item style={{ marginTop: 36, marginBottom: 36 }}>
                    <Button type="primary" htmlType="submit" loading={isLoading} block>
                      Надіслати посилання
                    </Button>
                  </Form.Item>

                  <Flex justify="flex-start" >
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

export default ForgotPasswordPage;

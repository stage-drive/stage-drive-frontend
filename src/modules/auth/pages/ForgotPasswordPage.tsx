import { useState } from 'react';
import { App, Button, Flex, Form, Input, Result, Typography } from 'antd';
import { ArrowLeftOutlined, MailOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import {
  useForgotPasswordMutation,
  type ForgotPasswordRequest,
} from '@/store/api/endpoints/authApi';
import { AuthSplitLayout } from '@/modules/auth/components/AuthSplitLayout';

const { Title, Paragraph } = Typography;

export const ForgotPasswordPage = () => {
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
    <AuthSplitLayout
      imageSrc="/images/forgot-bg.jpg"
      heroTitle="Повернемо доступ"
      heroDescription="Вкажіть email, прив'язаний до акаунта, і ми надішлемо інструкції для відновлення пароля."
    >
      {submittedEmail ? (
        <Result
          status="success"
          title="Перевірте пошту"
          subTitle={`Якщо акаунт з адресою ${submittedEmail} існує, на нього надійдуть інструкції для зміни пароля.`}
          extra={
            <Button type="primary" icon={<ArrowLeftOutlined />} onClick={() => navigate('/login')}>
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

            <Flex justify="flex-start">
              <Link to="/login">
                <ArrowLeftOutlined /> Повернутися до входу
              </Link>
            </Flex>
          </Form>
        </>
      )}
    </AuthSplitLayout>
  );
};

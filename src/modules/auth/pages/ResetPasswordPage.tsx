import { App, Button, Flex, Form, Input, Result, Typography } from 'antd';
import { ArrowLeftOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useResetPasswordMutation, type ResetPasswordRequest } from '@/store/api/endpoints/authApi';
import { AuthSplitLayout } from '@/modules/auth/components/AuthSplitLayout';

const { Title, Paragraph } = Typography;

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

export const ResetPasswordPage = () => {
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
    <AuthSplitLayout
      imageSrc="/images/forgot-bg.jpg"
      heroTitle="Створіть новий пароль"
      heroDescription="Введіть новий пароль для свого акаунта. Після підтвердження ви зможете увійти в систему з новими даними."
      heroDescriptionStyle={{ maxWidth: 420 }}
    >
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
            <Form.Item
              label="Новий пароль"
              name="password"
              rules={[
                { required: true, message: 'Введіть пароль' },
                { min: 8, message: 'Пароль має містити щонайменше 8 символів' },
                {
                  pattern: /[A-ZА-ЯІЇЄҐ]/,
                  message: 'Пароль має містити хоча б одну велику літеру',
                },
                {
                  pattern: /[a-zа-яіїєґ]/,
                  message: 'Пароль має містити хоча б одну малу літеру',
                },
                { pattern: /\d/, message: 'Пароль має містити хоча б одну цифру' },
                {
                  pattern: /[^A-Za-zА-Яа-яІіЇїЄєҐґ0-9]/,
                  message: 'Пароль має містити хоча б один спеціальний символ',
                },
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Введіть новий пароль"
                autoComplete="new-password"
              />
            </Form.Item>

            <Form.Item
              label="Підтвердження пароля"
              name="passwordConfirmation"
              dependencies={['password']}
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
            >
              <Input.Password
                prefix={<LockOutlined />}
                placeholder="Повторіть новий пароль"
                autoComplete="new-password"
              />
            </Form.Item>

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
    </AuthSplitLayout>
  );
};

import { App, Button, Flex, Form, Input, Result, Spin, Typography } from 'antd';
import { LockOutlined } from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  useActivateAccountMutation,
  useVerifyInvitationTokenQuery,
  type ActivateAccountRequest,
} from '@/store/api/endpoints/invitationsApi';
import { AuthSplitLayout } from '@/modules/auth/components/AuthSplitLayout';

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

export const AcceptInvitationPage = () => {
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
    <AuthSplitLayout
      imageSrc="/images/invite-bg.jpg"
      heroTitle="Ласкаво просимо!"
      heroDescription="Завершіть налаштування акаунта, щоб приєднатися до автошколи."
      heroTitleStyle={{ fontSize: 36, lineHeight: undefined }}
      heroDescriptionStyle={{ maxWidth: 380, fontSize: undefined, lineHeight: 1.6 }}
      contentMaxWidth={420}
      contentPadding={24}
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
              <Input.Password prefix={<LockOutlined />} placeholder="Введіть пароль" size="large" />
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
              <Button type="primary" htmlType="submit" size="large" block loading={isActivating}>
                Активувати акаунт
              </Button>
            </Form.Item>
          </Form>
        </>
      )}
    </AuthSplitLayout>
  );
};

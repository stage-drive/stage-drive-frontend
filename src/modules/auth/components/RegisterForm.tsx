import { App, Button, Checkbox, Col, Flex, Form, Input, Row, Typography } from 'antd';
import { Link, useNavigate } from 'react-router-dom';
import { UserOutlined, LockOutlined, MailOutlined, BankOutlined } from '@ant-design/icons';
import {
  useCheckRegistrationEmailMutation,
  useRegisterMutation,
  type RegisterRequest,
} from '@/store/api/endpoints/authApi';
import { PhoneInput } from '@/shared/components/PhoneInput';
import { normalizeUkrainianPhone, validateUkrainianPhone } from '@/shared/utils/ukrainianPhone';
import { AuthSplitLayout } from '@/modules/auth/components/AuthSplitLayout';

const { Title, Paragraph, Text } = Typography;

const emailFieldMessage = (error: unknown) => {
  const data = (
    error as { data?: { message?: string; errors?: { field?: string; message?: string }[] } }
  ).data;
  return data?.errors?.find((item) => item.field === 'email')?.message || data?.message;
};

export const RegisterForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { message } = App.useApp();

  const [register, { isLoading }] = useRegisterMutation();
  const [checkEmail] = useCheckRegistrationEmailMutation();

  const onEmailBlur = async () => {
    const email = String(form.getFieldValue('email') ?? '').trim();
    if (!email) return;

    try {
      await form.validateFields(['email']);
    } catch {
      return;
    }

    try {
      await checkEmail({ email }).unwrap();
    } catch (error: unknown) {
      const apiMessage = emailFieldMessage(error);
      if (!apiMessage) return;
      form.setFields([{ name: 'email', errors: [apiMessage] }]);
    }
  };

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

      const emailMessage = emailFieldMessage(err);
      if (emailMessage) {
        form.setFields([{ name: 'email', errors: [emailMessage] }]);
        return;
      }

      message.error(apiMessage || 'Помилка реєстрації');
    }
  };

  return (
    <AuthSplitLayout
      imageSrc="/images/register.jpg"
      heroTitle={
        <>
          Керуйте автошколою
          <br />в одному місці
        </>
      }
      heroDescription="CRM та LMS система для організації навчання, студентів, викладачів та розкладу."
      heroDescriptionStyle={{ color: 'rgba(255,255,255,0.9)' }}
      contentMaxWidth={500}
    >
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
          <Input prefix={<MailOutlined />} placeholder="example@autoschool.com" onBlur={onEmailBlur} />
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
    </AuthSplitLayout>
  );
};

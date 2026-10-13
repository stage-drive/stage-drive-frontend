import type { FC } from 'react';
import { Button, Card, Form, Input } from 'antd';
import type { FormInstance } from 'antd';
import { LockOutlined } from '@ant-design/icons';

export interface PasswordFormValues {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

interface ChangePasswordFormProps {
  form: FormInstance<PasswordFormValues>;
  isSaving: boolean;
  onSubmit: (values: PasswordFormValues) => void;
}

export const ChangePasswordForm: FC<ChangePasswordFormProps> = ({ form, isSaving, onSubmit }) => (
  <Card title="Зміна пароля">
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item
        label="Поточний пароль"
        name="currentPassword"
        rules={[{ required: true, message: 'Введіть поточний пароль' }]}
      >
        <Input.Password prefix={<LockOutlined />} autoComplete="current-password" />
      </Form.Item>
      <Form.Item
        label="Новий пароль"
        name="newPassword"
        rules={[
          { required: true, message: 'Введіть пароль' },
          { min: 8, message: 'Пароль має містити щонайменше 8 символів' },
          { pattern: /[A-ZА-ЯІЇЄҐ]/, message: 'Пароль має містити хоча б одну велику літеру' },
          { pattern: /[a-zа-яіїєґ]/, message: 'Пароль має містити хоча б одну малу літеру' },
          { pattern: /\d/, message: 'Пароль має містити хоча б одну цифру' },
          {
            pattern: /[^A-Za-zА-Яа-яІіЇїЄєҐґ0-9]/,
            message: 'Пароль має містити хоча б один спеціальний символ',
          },
        ]}
      >
        <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
      </Form.Item>
      <Form.Item
        label="Підтвердження нового пароля"
        name="confirmPassword"
        dependencies={['newPassword']}
        rules={[
          { required: true, message: 'Підтвердьте новий пароль' },
          ({ getFieldValue }) => ({
            validator(_, value: string | undefined) {
              if (!value || getFieldValue('newPassword') === value) return Promise.resolve();
              return Promise.reject(new Error('Паролі не збігаються'));
            },
          }),
        ]}
      >
        <Input.Password prefix={<LockOutlined />} autoComplete="new-password" />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isSaving}>
        Змінити пароль
      </Button>
    </Form>
  </Card>
);

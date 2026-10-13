import type { FC } from 'react';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import type { FormInstance } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import { PhoneInput } from '@/shared/components/PhoneInput';
import { validateUkrainianPhone } from '@/shared/utils/ukrainianPhone';
import type { UpdateProfileRequest } from '@/store/api/endpoints/authApi';

export interface ProfileFormValues extends UpdateProfileRequest {
  email?: string;
}

interface ProfileDetailsFormProps {
  form: FormInstance<ProfileFormValues>;
  isSaving: boolean;
  onSubmit: (values: ProfileFormValues) => void;
}

export const ProfileDetailsForm: FC<ProfileDetailsFormProps> = ({ form, isSaving, onSubmit }) => (
  <Card title="Особисті дані">
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Row gutter={16}>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Ім'я"
            name="firstName"
            rules={[{ required: true, whitespace: true, message: "Введіть ім'я" }]}
          >
            <Input autoComplete="given-name" />
          </Form.Item>
        </Col>
        <Col xs={24} sm={12}>
          <Form.Item
            label="Прізвище"
            name="lastName"
            rules={[{ required: true, whitespace: true, message: 'Введіть прізвище' }]}
          >
            <Input autoComplete="family-name" />
          </Form.Item>
        </Col>
      </Row>
      <Form.Item
        label="Email"
        name="email"
        extra="Email змінити поки неможливо: відповідні API endpoints ще не реалізовані на сервері."
      >
        <Input prefix={<MailOutlined />} autoComplete="email" disabled />
      </Form.Item>
      <Form.Item label="Телефон" name="phone" rules={[{ validator: validateUkrainianPhone }]}>
        <PhoneInput />
      </Form.Item>
      <Button type="primary" htmlType="submit" loading={isSaving}>
        Зберегти зміни
      </Button>
    </Form>
  </Card>
);


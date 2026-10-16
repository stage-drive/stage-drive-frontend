import React from 'react';
import { Button, Flex, Form, Input, Modal, Select } from 'antd';
import type { FormInstance } from 'antd';
import { PhoneInput } from '@/shared/components/PhoneInput';
import { validateUkrainianPhone } from '@/shared/utils/ukrainianPhone';
import type { SendMemberInviteRequest } from '@/store/api/endpoints/invitationsApi';

const roleOptions = [
  { value: 'TEACHER', label: 'Викладач' },
  { value: 'INSTRUCTOR', label: 'Інструктор' },
];

interface InviteMemberFormModalProps {
  open: boolean;
  form: FormInstance<SendMemberInviteRequest>;
  isSending: boolean;
  onClose: () => void;
  onSubmit: (values: SendMemberInviteRequest) => void;
}

export const InviteMemberFormModal: React.FC<InviteMemberFormModalProps> = ({
  open,
  form,
  isSending,
  onClose,
  onSubmit,
}) => (
  <Modal
    centered
    title="Додати учасника"
    open={open}
    onCancel={onClose}
    footer={null}
    forceRender
  >
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Form.Item
        label="Роль"
        name="role"
        rules={[{ required: true, message: 'Оберіть роль учасника' }]}
      >
        <Select placeholder="Оберіть роль" options={roleOptions} />
      </Form.Item>

      <Form.Item
        label="Ім'я та по-батькові"
        name="firstName"
        rules={[{ required: true, whitespace: true, message: "Введіть ім'я" }]}
      >
        <Input autoComplete="given-name" />
      </Form.Item>

      <Form.Item
        label="Прізвище"
        name="lastName"
        rules={[{ required: true, whitespace: true, message: 'Введіть прізвище' }]}
      >
        <Input autoComplete="family-name" />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: 'Введіть email' },
          { type: 'email', message: 'Введіть коректний email' },
        ]}
      >
        <Input autoComplete="email" />
      </Form.Item>

      <Form.Item
        label="Номер телефону"
        name="phone"
        rules={[{ validator: validateUkrainianPhone }]}
      >
        <PhoneInput />
      </Form.Item>

      <Flex justify="flex-end" gap={8}>
        <Button onClick={onClose}>Скасувати</Button>
        <Button type="primary" htmlType="submit" loading={isSending}>
          Надіслати запрошення
        </Button>
      </Flex>
    </Form>
  </Modal>
);

import React from 'react';
import { Button, DatePicker, Flex, Form, Input, Modal, Select } from 'antd';
import type { FormInstance } from 'antd';
import { PhoneInput } from '../../../shared/components/PhoneInput';
import { validateUkrainianPhone } from '../../../shared/utils/ukrainianPhone';
import type { SendMemberInviteRequest } from '../../../store/api/endpoints/invitationsApi';

const roleOptions = [
  { value: 'TEACHER', label: 'Викладач' },
  { value: 'INSTRUCTOR', label: 'Інструктор' },
];

const studentCategoryOptions = ['A', 'B', 'C', 'D', 'BE', 'CE', 'DE'];
const gearboxOptions = [
  { value: 'MANUAL', label: 'Механіка' },
  { value: 'AUTOMATIC', label: 'Автомат' },
];

export interface StudentInviteFormValues extends SendMemberInviteRequest {
  category?: string;
  transmission?: 'MANUAL' | 'AUTOMATIC';
  birthDate?: string;
  address?: string;
  contractNumber?: string;
  groupId?: string;
  practiceHoursPaid?: number;
}

interface InviteMemberFormModalProps {
  open: boolean;
  form: FormInstance<StudentInviteFormValues>;
  isSending: boolean;
  onClose: () => void;
  onSubmit: (values: StudentInviteFormValues) => void;
  hideRole?: boolean;
  showStudentFields?: boolean;
}

export const InviteMemberFormModal: React.FC<InviteMemberFormModalProps> = ({
  open,
  form,
  isSending,
  onClose,
  onSubmit,
  hideRole = false,
  showStudentFields = false,
}) => (
  <Modal
    centered
    title={showStudentFields ? 'Додати студента' : 'Додати учасника'}
    open={open}
    onCancel={onClose}
    footer={null}
    forceRender
  >
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      {!hideRole && (
        <Form.Item
          label="Роль"
          name="role"
          rules={[{ required: true, message: 'Оберіть роль учасника' }]}
        >
          <Select placeholder="Оберіть роль" options={roleOptions} />
        </Form.Item>
      )}

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

      {showStudentFields && (
        <>
          <Form.Item
            label="Категорія"
            name="category"
            rules={[{ required: true, message: 'Оберіть категорію' }]}
          >
            <Select
              placeholder="Оберіть категорію"
              options={studentCategoryOptions.map((item) => ({ value: item, label: item }))}
            />
          </Form.Item>

          <Form.Item
            label="Коробка передач"
            name="transmission"
            rules={[{ required: true, message: 'Оберіть коробку передач' }]}
          >
            <Select placeholder="Оберіть коробку передач" options={gearboxOptions} />
          </Form.Item>

          <Form.Item label="Група (groupId)" name="groupId">
            <Input placeholder="Необов'язково. UUID групи" />
          </Form.Item>

          <Form.Item label="Дата народження" name="birthDate">
            <DatePicker format="DD.MM.YYYY" style={{ width: '100%' }} placeholder="Необов'язково" />
          </Form.Item>

          <Form.Item label="Адреса" name="address">
            <Input placeholder="Необов'язково" />
          </Form.Item>

          <Form.Item label="Номер договору" name="contractNumber">
            <Input placeholder="Необов'язково" />
          </Form.Item>

          <Form.Item label="Кількість оплаченої практики (годин)" name="practiceHoursPaid">
            <Input type="number" min={0} placeholder="Необов'язково" />
          </Form.Item>
        </>
      )}

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

import React from 'react';
import { Button, Col, DatePicker, Flex, Form, Input, Modal, Row, Select } from 'antd';
import type { FormInstance } from 'antd';
import type { Dayjs } from 'dayjs';
import { PhoneInput } from '@/shared/components/PhoneInput';
import { validateUkrainianPhone } from '@/shared/utils/ukrainianPhone';
import { STUDENT_CATEGORIES, TRANSMISSION_LABELS } from '@/modules/students/constants';

const gearboxOptions = (Object.keys(TRANSMISSION_LABELS) as Array<keyof typeof TRANSMISSION_LABELS>).map(
  (value) => ({ value, label: TRANSMISSION_LABELS[value] }),
);

export interface StudentFormValues {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  category?: string;
  transmission?: 'MANUAL' | 'AUTOMATIC';
  groupId?: string;
  birthDate?: Dayjs | null;
  address?: string;
  contractNumber?: string;
}

interface StudentFormModalProps {
  open: boolean;
  form: FormInstance<StudentFormValues>;
  isSending: boolean;
  onClose: () => void;
  onSubmit: (values: StudentFormValues) => void;
  title: string;
  okText: string;
  lockEmail?: boolean;
  showProfileDetails?: boolean;
  groupOptions?: { value: string; label: string }[];
}

export const StudentFormModal: React.FC<StudentFormModalProps> = ({
  open,
  form,
  isSending,
  onClose,
  onSubmit,
  title,
  okText,
  lockEmail = false,
  showProfileDetails = false,
  groupOptions,
}) => (
  <Modal
    centered
    width={760}
    title={title}
    open={open}
    onCancel={onClose}
    footer={null}
    forceRender
    styles={{ body: { overflow: 'visible' } }}
  >
    <Form form={form} layout="vertical" onFinish={onSubmit}>
      <Row gutter={16}>
        <Col span={12}>
          <Form.Item
            label="Ім'я та по-батькові"
            name="firstName"
            rules={[{ required: true, whitespace: true, message: "Введіть ім'я" }]}
          >
            <Input autoComplete="given-name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Прізвище"
            name="lastName"
            rules={[{ required: true, whitespace: true, message: 'Введіть прізвище' }]}
          >
            <Input autoComplete="family-name" />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Email"
            name="email"
            rules={[
              { required: true, message: 'Введіть email' },
              { type: 'email', message: 'Введіть коректний email' },
            ]}
          >
            <Input autoComplete="email" disabled={lockEmail} />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Номер телефону"
            name="phone"
            rules={[{ validator: validateUkrainianPhone }]}
          >
            <PhoneInput />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Категорія"
            name="category"
            rules={[{ required: true, message: 'Оберіть категорію' }]}
          >
            <Select
              placeholder="Оберіть категорію"
              options={STUDENT_CATEGORIES.map((item) => ({ value: item, label: item }))}
            />
          </Form.Item>
        </Col>
        <Col span={12}>
          <Form.Item
            label="Коробка передач"
            name="transmission"
            rules={[{ required: true, message: 'Оберіть коробку передач' }]}
          >
            <Select placeholder="Оберіть коробку передач" options={gearboxOptions} />
          </Form.Item>
        </Col>
        {showProfileDetails ? (
          <>
            <Col span={12}>
              <Form.Item label="Дата народження" name="birthDate">
                <DatePicker style={{ width: '100%' }} format="DD.MM.YYYY" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Номер договору" name="contractNumber">
                <Input placeholder="Наприклад, ДГ-2026-0142" allowClear />
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Адреса" name="address">
                <Input.TextArea rows={2} placeholder="Місто, вулиця, будинок" allowClear />
              </Form.Item>
            </Col>
          </>
        ) : null}
        {groupOptions && (
          <Col span={12}>
            <Form.Item label="Навчальна група" name="groupId">
              <Select
                allowClear
                placeholder="Необов'язково"
                options={groupOptions}
                notFoundContent="Немає груп зі статусом запланована або активна"
              />
            </Form.Item>
          </Col>
        )}
      </Row>

      <Flex justify="flex-end" gap={8}>
        <Button onClick={onClose}>Скасувати</Button>
        <Button type="primary" htmlType="submit" loading={isSending}>
          {okText}
        </Button>
      </Flex>
    </Form>
  </Modal>
);

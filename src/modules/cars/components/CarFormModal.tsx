import { Button, Col, Flex, Form, Input, Modal, Row, Select } from 'antd';
import type { FormInstance } from 'antd';
import { CAR_CATEGORIES } from '@/modules/cars/constants';
import { normalizePlateNumber } from '@/modules/cars/utils/carActions';
import { CATEGORY_LABELS, TRANSMISSION_LABELS } from '@/modules/students/constants';
import { useGetOrganizationMembersQuery } from '@/store/api/endpoints/usersApi';
import type { StudentTransmission } from '@/store/api/endpoints/studentsApi';

const gearboxOptions = (Object.keys(TRANSMISSION_LABELS) as StudentTransmission[]).map((value) => ({
  value,
  label: TRANSMISSION_LABELS[value],
}));

export interface CarFormValues {
  plateNumber: string;
  category: (typeof CAR_CATEGORIES)[number];
  transmission: StudentTransmission;
  instructorId?: string;
}

interface CarFormModalProps {
  open: boolean;
  form: FormInstance<CarFormValues>;
  isSending: boolean;
  title: string;
  okText: string;
  showInstructor?: boolean;
  onClose: () => void;
  onSubmit: (values: CarFormValues) => void;
}

export const CarFormModal = ({
  open,
  form,
  isSending,
  title,
  okText,
  showInstructor = false,
  onClose,
  onSubmit,
}: CarFormModalProps) => {
  const { data: instructorsData, isLoading: isInstructorsLoading } = useGetOrganizationMembersQuery(
    { role: 'INSTRUCTOR', status: 'ACTIVE', limit: 100 },
    { skip: !open || !showInstructor },
  );

  const instructorOptions = (instructorsData?.users ?? []).map((user) => ({
    value: user.id,
    label: `${user.lastName} ${user.firstName}`,
  }));

  return (
    <Modal
      centered
      width={720}
      title={title}
      open={open}
      onCancel={onClose}
      footer={null}
      forceRender
    >
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item
              label="Державний номер"
              name="plateNumber"
              rules={[
                { required: true, whitespace: true, message: 'Введіть державний номер' },
                {
                  validator: (_, value: string | undefined) => {
                    if (!value?.trim()) return Promise.resolve();
                    if (normalizePlateNumber(value).length > 16) {
                      return Promise.reject(new Error('Номер не довший за 16 символів'));
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <Input placeholder="AA0001BB" />
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
                options={CAR_CATEGORIES.map((item) => ({
                  value: item,
                  label: CATEGORY_LABELS[item],
                }))}
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
          {showInstructor ? (
            <Col span={12}>
              <Form.Item
                label="Інструктор"
                name="instructorId"
                rules={[{ required: true, message: 'Оберіть інструктора' }]}
              >
                <Select
                  showSearch
                  optionFilterProp="label"
                  loading={isInstructorsLoading}
                  placeholder="Оберіть активного інструктора"
                  options={instructorOptions}
                  notFoundContent="Немає активних інструкторів"
                />
              </Form.Item>
            </Col>
          ) : null}
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
};

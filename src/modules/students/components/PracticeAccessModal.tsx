import { useEffect } from 'react';
import { Form, Modal, Select } from 'antd';
import { useGetCarsQuery } from '@/store/api/endpoints/carsApi';
import { useGetOrganizationMembersQuery } from '@/store/api/endpoints/usersApi';
import type { StudentCategory, StudentTransmission } from '@/store/api/endpoints/studentsApi';
import { TRANSMISSION_LABELS } from '@/modules/students/constants';

interface PracticeAccessModalProps {
  open: boolean;
  isSending: boolean;
  category: StudentCategory | null | undefined;
  transmission: StudentTransmission | null | undefined;
  onClose: () => void;
  onSubmit: (values: { instructorId: string; carId: string }) => void;
}

export const PracticeAccessModal = ({
  open,
  isSending,
  category,
  transmission,
  onClose,
  onSubmit,
}: PracticeAccessModalProps) => {
  const [form] = Form.useForm<{ instructorId: string; carId: string }>();
  const instructorId = Form.useWatch('instructorId', form);

  const { data: instructorsData, isLoading: isInstructorsLoading } = useGetOrganizationMembersQuery(
    { role: 'INSTRUCTOR', status: 'ACTIVE', limit: 100 },
    { skip: !open },
  );

  const { data: carsData, isLoading: isCarsLoading } = useGetCarsQuery(
    {
      instructorId,
      category: category ?? undefined,
      transmission: transmission ?? undefined,
      status: 'AVAILABLE',
      limit: 100,
    },
    { skip: !open || !instructorId || !category || !transmission },
  );

  useEffect(() => {
    form.setFieldValue('carId', undefined);
  }, [form, instructorId]);

  const instructorOptions = (instructorsData?.users ?? []).map((user) => ({
    value: user.id,
    label: `${user.lastName} ${user.firstName}`,
  }));

  const carOptions = (carsData?.cars ?? []).map((car) => ({
    value: car.id,
    label: `${car.plateNumber} · ${car.category} · ${TRANSMISSION_LABELS[car.transmission]}`,
  }));

  return (
    <Modal
      centered
      title="Відкрити доступ до практики"
      open={open}
      okText="Призначити"
      cancelText="Скасувати"
      confirmLoading={isSending}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() =>
        void form.validateFields().then((values) =>
          onSubmit({ instructorId: values.instructorId, carId: values.carId }),
        )
      }
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
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
        <Form.Item
          label="Автомобіль"
          name="carId"
          rules={[{ required: true, message: 'Оберіть автомобіль' }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            disabled={!instructorId}
            loading={isCarsLoading}
            placeholder={
              instructorId
                ? 'Оберіть автомобіль інструктора'
                : 'Спочатку оберіть інструктора'
            }
            options={carOptions}
            notFoundContent="Немає доступних авто з потрібною категорією та коробкою"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

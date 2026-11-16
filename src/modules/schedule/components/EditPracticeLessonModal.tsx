import { useEffect } from 'react';
import { Form, InputNumber, Modal, Select } from 'antd';
import { useGetCarsQuery } from '@/store/api/endpoints/carsApi';

interface PracticeLessonValues {
  durationMin: number;
  carId?: string;
}

interface EditPracticeLessonModalProps {
  open: boolean;
  isSending: boolean;
  onClose: () => void;
  onSubmit: (body: PracticeLessonValues) => void;
}

export const EditPracticeLessonModal = ({
  open,
  isSending,
  onClose,
  onSubmit,
}: EditPracticeLessonModalProps) => {
  const [form] = Form.useForm<PracticeLessonValues>();
  const { data, isLoading } = useGetCarsQuery(
    { status: 'AVAILABLE', limit: 100 },
    { skip: !open },
  );

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({ durationMin: 60 });
  }, [form, open]);

  const carOptions = (data?.cars ?? []).map((car) => ({
    value: car.id,
    label: `${car.plateNumber} · ${car.category}`,
  }));

  return (
    <Modal
      centered
      title="Редагувати практичне заняття"
      open={open}
      okText="Зберегти"
      cancelText="Скасувати"
      confirmLoading={isSending}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => void form.validateFields().then(onSubmit)}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Тривалість, хв"
          name="durationMin"
          rules={[
            { required: true, message: 'Вкажіть тривалість' },
            { type: 'number', min: 15, max: 240, message: 'Від 15 до 240 хвилин' },
          ]}
        >
          <InputNumber min={15} max={240} step={15} style={{ width: '100%' }} />
        </Form.Item>
        <Form.Item label="Автомобіль" name="carId">
          <Select
            allowClear
            showSearch
            optionFilterProp="label"
            loading={isLoading}
            placeholder="Залишити поточний або обрати інший"
            options={carOptions}
            notFoundContent="Немає доступних автомобілів"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

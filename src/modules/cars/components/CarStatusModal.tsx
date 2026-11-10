import { Form, Modal, Select } from 'antd';
import { CAR_STATUS_LABELS } from '@/modules/cars/constants';
import type { CarStatus } from '@/store/api/endpoints/carsApi';

interface CarStatusModalProps {
  open: boolean;
  isSending: boolean;
  options: CarStatus[];
  onClose: () => void;
  onSubmit: (status: CarStatus) => void;
}

export const CarStatusModal = ({
  open,
  isSending,
  options,
  onClose,
  onSubmit,
}: CarStatusModalProps) => {
  const [form] = Form.useForm<{ status: CarStatus }>();

  return (
    <Modal
      centered
      title="Змінити статус автомобіля"
      open={open}
      okText="Зберегти"
      cancelText="Скасувати"
      confirmLoading={isSending}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => void form.validateFields().then((values) => onSubmit(values.status))}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Статус"
          name="status"
          rules={[{ required: true, message: 'Оберіть статус' }]}
        >
          <Select
            placeholder="Оберіть статус"
            options={options.map((status) => ({
              value: status,
              label: CAR_STATUS_LABELS[status],
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

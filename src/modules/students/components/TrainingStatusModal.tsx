import { Form, Modal, Select } from 'antd';
import { TRAINING_STATUS_LABELS } from '@/modules/students/constants';
import type { TrainingStatus } from '@/store/api/endpoints/studentsApi';

interface TrainingStatusModalProps {
  open: boolean;
  isSending: boolean;
  options: TrainingStatus[];
  onClose: () => void;
  onSubmit: (status: TrainingStatus) => void;
}

export const TrainingStatusModal = ({
  open,
  isSending,
  options,
  onClose,
  onSubmit,
}: TrainingStatusModalProps) => {
  const [form] = Form.useForm<{ status: TrainingStatus }>();

  return (
    <Modal
      centered
      title="Змінити статус навчання"
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
          label="Статус навчання"
          name="status"
          rules={[{ required: true, message: 'Оберіть статус навчання' }]}
        >
          <Select
            placeholder="Оберіть статус"
            options={options.map((status) => ({
              value: status,
              label: TRAINING_STATUS_LABELS[status],
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

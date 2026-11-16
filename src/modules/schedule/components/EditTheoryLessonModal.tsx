import { useEffect } from 'react';
import { Form, Input, InputNumber, Modal } from 'antd';

interface TheoryLessonValues {
  topic: string;
  durationMin: number;
}

interface EditTheoryLessonModalProps {
  open: boolean;
  isSending: boolean;
  topic?: string;
  onClose: () => void;
  onSubmit: (body: TheoryLessonValues) => void;
}

export const EditTheoryLessonModal = ({
  open,
  isSending,
  topic,
  onClose,
  onSubmit,
}: EditTheoryLessonModalProps) => {
  const [form] = Form.useForm<TheoryLessonValues>();

  useEffect(() => {
    if (!open) return;
    form.setFieldsValue({ topic, durationMin: 90 });
  }, [form, open, topic]);

  return (
    <Modal
      centered
      title="Редагувати теоретичне заняття"
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
          label="Тема"
          name="topic"
          rules={[{ required: true, whitespace: true, message: 'Вкажіть тему' }]}
        >
          <Input maxLength={200} />
        </Form.Item>
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
      </Form>
    </Modal>
  );
};

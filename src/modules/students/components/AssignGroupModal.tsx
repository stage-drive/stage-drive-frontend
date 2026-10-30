import { Form, Modal, Select } from 'antd';
import { useGetGroupsQuery } from '@/store/api/endpoints/groupsApi';

interface AssignGroupModalProps {
  open: boolean;
  isSending: boolean;
  onClose: () => void;
  onSubmit: (groupId: string) => void;
}

export const AssignGroupModal = ({ open, isSending, onClose, onSubmit }: AssignGroupModalProps) => {
  const [form] = Form.useForm<{ groupId: string }>();
  const { data, isLoading } = useGetGroupsQuery(undefined, { skip: !open });
  const groupOptions = (data?.groups ?? [])
    .filter((group) => group.status === 'PLANNED' || group.status === 'ACTIVE')
    .map((group) => ({ value: group.id, label: group.name }));

  return (
    <Modal
      centered
      title="Призначити навчальну групу"
      open={open}
      okText="Призначити"
      cancelText="Скасувати"
      confirmLoading={isSending}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      onOk={() => void form.validateFields().then((values) => onSubmit(values.groupId))}
      destroyOnHidden
    >
      <Form form={form} layout="vertical">
        <Form.Item
          label="Навчальна група"
          name="groupId"
          rules={[{ required: true, message: 'Оберіть навчальну групу' }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            loading={isLoading}
            placeholder="Оберіть групу"
            options={groupOptions}
            notFoundContent="Немає груп зі статусом запланована або активна"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
};

import { Button, Flex, Form, Modal, Select } from 'antd';
import { useGetOrganizationMembersQuery } from '@/store/api/endpoints/usersApi';

interface AssignInstructorModalProps {
  open: boolean;
  isSending: boolean;
  canClear: boolean;
  onClose: () => void;
  onSubmit: (instructorId: string | null) => void;
}

export const AssignInstructorModal = ({
  open,
  isSending,
  canClear,
  onClose,
  onSubmit,
}: AssignInstructorModalProps) => {
  const [form] = Form.useForm<{ instructorId: string }>();
  const { data, isLoading } = useGetOrganizationMembersQuery(
    { role: 'INSTRUCTOR', status: 'ACTIVE', limit: 100 },
    { skip: !open },
  );

  const options = (data?.users ?? []).map((user) => ({
    value: user.id,
    label: `${user.lastName} ${user.firstName}`,
  }));

  return (
    <Modal
      centered
      title="Інструктор автомобіля"
      open={open}
      onCancel={() => {
        form.resetFields();
        onClose();
      }}
      footer={null}
      destroyOnHidden
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={(values) => onSubmit(values.instructorId)}
      >
        <Form.Item
          label="Інструктор"
          name="instructorId"
          rules={[{ required: true, message: 'Оберіть інструктора' }]}
        >
          <Select
            showSearch
            optionFilterProp="label"
            loading={isLoading}
            placeholder="Оберіть активного інструктора"
            options={options}
            notFoundContent="Немає активних інструкторів"
          />
        </Form.Item>
        <Flex justify="flex-end" gap={8}>
          <Button
            onClick={() => {
              form.resetFields();
              onClose();
            }}
          >
            Скасувати
          </Button>
          {canClear ? (
            <Button danger loading={isSending} onClick={() => onSubmit(null)}>
              Зняти
            </Button>
          ) : null}
          <Button type="primary" htmlType="submit" loading={isSending}>
            Призначити
          </Button>
        </Flex>
      </Form>
    </Modal>
  );
};

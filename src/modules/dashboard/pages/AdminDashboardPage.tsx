import { Button, Form, type FormProps, Input, Modal } from 'antd';
import { useState } from 'react';
import {
  type SendInviteRequest,
  useSendInvitationMutation,
} from '@/store/api/endpoints/invitationsApi.ts';
import AlertMessage from '@/helper/pages/AlertMessage.tsx';

export const AdminDashboardPage = () => {
  const [invite] = useSendInvitationMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [alert, setAlert] = useState<{
    title: string;
    description: string;
    type: 'success' | 'error';
  } | null>(null);

  const onFinish: FormProps<SendInviteRequest>['onFinish'] = async (values) => {
    try {
      await invite(values).unwrap();
      setAlert({
        title: 'Invitation',
        description: 'success sent invitation',
        type: 'success',
      });
      setIsModalOpen(false);
    } catch (error) {
      console.error('Failed to send invitation:', error);
      setAlert({
        title: 'Invitation',
        description: 'error sent invitation',
        type: 'error',
      });
    }
  };

  const onFinishFailed: FormProps<SendInviteRequest>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };


  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleOk = () => {
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      {alert && (
        <AlertMessage description={alert.description} title={alert.title} type={alert.type} />
      )}

      <Button type="primary" onClick={showModal}>
        Відкрити вікно
      </Button>

      <Modal
        title="Запросити користувача"
        closable={{ 'aria-label': 'Кнопка закриття' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form<SendInviteRequest>
          name="basic"
          labelCol={{ span: 8 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}
          autoComplete="off"
        >
          <Form.Item<SendInviteRequest>
            label="Ім'я"
            name="firstName"
            rules={[
              {
                required: true,
                message: "Будь ласка, введіть ім'я!",
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<SendInviteRequest>
            label="Прізвище"
            name="lastName"
            rules={[
              {
                required: true,
                message: 'Будь ласка, введіть прізвище!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<SendInviteRequest>
            label="Електронна пошта"
            name="email"
            rules={[
              {
                required: true,
                message: 'Будь ласка, введіть електронну пошту!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item<SendInviteRequest>
            label="Телефон"
            name="phone"
            rules={[
              {
                required: true,
                message: 'Будь ласка, введіть номер телефону!',
              },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Надіслати запрошення
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

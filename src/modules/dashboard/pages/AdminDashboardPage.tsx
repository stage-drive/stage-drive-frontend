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
        Open Modal
      </Button>
      <Modal
        title="Basic Modal"
        closable={{ 'aria-label': 'Custom Close Button' }}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form
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
            label="FirstName"
            name="firstName"
            rules={[{ required: true, message: 'Please input your firstName!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<SendInviteRequest>
            label="LastName"
            name="lastName"
            rules={[{ required: true, message: 'Please input your lastName!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<SendInviteRequest>
            label="Email"
            name="email"
            rules={[{ required: true, message: 'Please input your email!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item<SendInviteRequest>
            label="Phone"
            name="phone"
            rules={[{ required: true, message: 'Please input your phone!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

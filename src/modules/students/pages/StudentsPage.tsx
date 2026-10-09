import React, { useState } from 'react';
import { Alert, App, Button, Flex, Form, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  useCancelInvitationMutation,
  useGetInvitationsQuery,
  useResendInvitationMutation,
} from '../../../store/api/endpoints/invitationsApi';
import { normalizeUkrainianPhone } from '../../../shared/utils/ukrainianPhone';
import { useCreateStudentMutation } from '../../../store/api/endpoints/studentsApi';
import {
  InviteMemberFormModal,
  type StudentInviteFormValues,
} from '../../users/components/InviteMemberFormModal';
import { InvitationTable } from '../../users/components/InvitationTable';

const { Title, Paragraph } = Typography;

export const StudentsPage: React.FC = () => {
  const [form] = Form.useForm<StudentInviteFormValues>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancellingInvitationId, setCancellingInvitationId] = useState<string | null>(null);
  const [resendingInvitationId, setResendingInvitationId] = useState<string | null>(null);

  const [createStudent, { isLoading: isSending }] = useCreateStudentMutation();
  const [cancelInvitation, { isLoading: isCancelling }] = useCancelInvitationMutation();
  const [resendInvitation, { isLoading: isResending }] = useResendInvitationMutation();

  const { data: invitations = [], isLoading, error } = useGetInvitationsQuery();

  const studentInvitations = invitations.filter((invitation) => invitation.role === 'STUDENT');
  const { message, modal } = App.useApp();

  const openAddStudentModal = () => {
    form.resetFields();
    form.setFieldValue('role', 'STUDENT');
    setIsModalOpen(true);
  };

  const onFinish = async (values: StudentInviteFormValues) => {
    try {
      await createStudent({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone ? normalizeUkrainianPhone(values.phone) : undefined,
        groupId: values.groupId || undefined,
        category: values.category as 'A' | 'B' | 'C' | 'D' | 'BE' | 'CE' | 'DE' | undefined,
        transmission: values.transmission as 'MANUAL' | 'AUTOMATIC' | undefined,
      }).unwrap();

      message.success('Студента успішно створено і запрошення надіслано');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: unknown) {
      const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
      message.error(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Не вдалося надіслати запрошення студенту'
      );
    }
  };

  const onCancelInvitation = async (invitationId: string) => {
    setCancellingInvitationId(invitationId);
    try {
      await cancelInvitation(invitationId).unwrap();
      message.success('Запрошення скасовано');
    } catch (error: unknown) {
      const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
      message.error(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Не вдалося скасувати запрошення'
      );
    } finally {
      setCancellingInvitationId(null);
    }
  };

  const onResendInvitation = async (invitationId: string) => {
    setResendingInvitationId(invitationId);
    try {
      await resendInvitation(invitationId).unwrap();
      message.success('Лист запрошення повторно поставлено в чергу');
    } catch (error: unknown) {
      const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
      message.error(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Не вдалося повторно надіслати запрошення'
      );
    } finally {
      setResendingInvitationId(null);
    }
  };

  const confirmResendInvitation = (invitationId: string) => {
    modal.confirm({
      title: 'Надіслати запрошення повторно?',
      content: 'Для студента буде створено нове посилання, а попереднє перестане діяти.',
      okText: 'Надіслати',
      cancelText: 'Не надсилати',
      onOk: () => onResendInvitation(invitationId),
    });
  };

  const confirmCancelInvitation = (invitationId: string) => {
    modal.confirm({
      title: 'Скасувати запрошення для студента?',
      content: 'Посилання в листі більше не можна буде використати.',
      okText: 'Скасувати',
      cancelText: 'Залишити',
      okButtonProps: { danger: true },
      onOk: () => onCancelInvitation(invitationId),
    });
  };

  return (
    <section>
      <Flex align="center" justify="space-between" wrap gap={16}>
        <div>
          <Title level={2} style={{ margin: 0 }}>
            Студенти
          </Title>
          <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
            Додавання нового студента з автоматичним запрошенням до активації акаунта
          </Paragraph>
        </div>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddStudentModal}>
          Додати студента
        </Button>
      </Flex>

      {error && (
        <Alert
          type="error"
          showIcon
          message="Не вдалося завантажити список студентів"
          style={{ marginTop: 24 }}
        />
      )}

      <InvitationTable
        invitations={studentInvitations}
        isLoading={isLoading}
        isResending={isResending}
        resendingInvitationId={resendingInvitationId}
        isCancelling={isCancelling}
        cancellingInvitationId={cancellingInvitationId}
        onResendInvitation={confirmResendInvitation}
        onCancelInvitation={confirmCancelInvitation}
      />

      <InviteMemberFormModal
        open={isModalOpen}
        form={form}
        isSending={isSending}
        onClose={() => {
          form.resetFields();
          setIsModalOpen(false);
        }}
        onSubmit={onFinish}
        hideRole
        showStudentFields
      />
    </section>
  );
};

export default StudentsPage;

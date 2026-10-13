import React, { useState } from 'react';
import { Alert, App, Flex, Form } from 'antd';
import {
  useGetInvitationsQuery,
  useCancelInvitationMutation,
  useResendInvitationMutation,
  useSendMemberInvitationMutation,
  type SendMemberInviteRequest,
} from '@/store/api/endpoints/invitationsApi';
import { normalizeUkrainianPhone } from '@/shared/utils/ukrainianPhone';
import { InvitationPageHeader } from '@/modules/invitations/components/InvitationPageHeader';
import { InvitationTable } from '@/modules/invitations/components/InvitationTable';
import { InviteMemberFormModal } from '@/modules/invitations/components/InviteMemberFormModal';

export const InviteMemberPage: React.FC = () => {
  const [form] = Form.useForm<SendMemberInviteRequest>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [cancellingInvitationId, setCancellingInvitationId] = useState<string | null>(null);
  const [resendingInvitationId, setResendingInvitationId] = useState<string | null>(null);
  const [sendInvitation, { isLoading: isSending }] = useSendMemberInvitationMutation();
  const [cancelInvitation, { isLoading: isCancelling }] = useCancelInvitationMutation();
  const [resendInvitation, { isLoading: isResending }] = useResendInvitationMutation();
  const {
    data: invitations = [],
    isLoading,
    isFetching,
    error,
    refetch,
  } = useGetInvitationsQuery();
  const { message, modal } = App.useApp();

  const onFinish = async (values: SendMemberInviteRequest) => {
    try {
      await sendInvitation({ ...values, phone: normalizeUkrainianPhone(values.phone) }).unwrap();
      message.success('Запрошення успішно створено');
      setIsModalOpen(false);
      form.resetFields();
    } catch (error: unknown) {
      const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
      message.error(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Не вдалося надіслати запрошення'
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
      content: 'Для запрошення буде створено нове посилання, а попереднє перестане діяти.',
      okText: 'Надіслати',
      cancelText: 'Не надсилати',
      onOk: () => onResendInvitation(invitationId),
    });
  };

  const confirmCancelInvitation = (invitationId: string) => {
    modal.confirm({
      title: 'Скасувати це запрошення?',
      content: 'Посилання з листа більше не можна буде використати.',
      okText: 'Скасувати',
      cancelText: 'Залишити',
      okButtonProps: { danger: true },
      onOk: () => onCancelInvitation(invitationId),
    });
  };

  return (
    <Flex vertical>
      <InvitationPageHeader
        isFetching={isFetching}
        onRefresh={() => void refetch()}
        onAddInvitation={() => setIsModalOpen(true)}
      />

      {error && (
        <Alert
          type="error"
          showIcon
          title="Не вдалося завантажити список користувачів"
          style={{ marginTop: 24 }}
        />
      )}

      <InvitationTable
        invitations={invitations}
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
        onClose={() => setIsModalOpen(false)}
        onSubmit={onFinish}
      />
    </Flex>
  );
};

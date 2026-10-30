import { useEffect } from 'react';
import { Alert, App, Card, Flex, Form, Skeleton } from 'antd';
import type { UploadProps } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  useChangeMyPasswordMutation,
  useDeleteMeMutation,
  useDeleteMyAvatarMutation,
  useGetMeQuery,
  useUpdateMeMutation,
  useUploadMyAvatarMutation,
} from '@/store/api/endpoints/authApi';
import { baseApi } from '@/store/api/baseApi';
import { formatUkrainianPhone, normalizeUkrainianPhone } from '@/shared/utils/ukrainianPhone';
import { ProfileAvatar } from '@/modules/profile/components/ProfileAvatar';
import {
  ProfileDetailsForm,
  type ProfileFormValues,
} from '@/modules/profile/components/ProfileDetailsForm';
import {
  ChangePasswordForm,
  type PasswordFormValues,
} from '@/modules/profile/components/ChangePasswordForm';
import { DeleteAccountSection } from '@/modules/profile/components/DeleteAccountSection';

interface ApiError {
  data?: {
    message?: string | string[];
  };
}

const getErrorMessage = (error: unknown, fallback: string) => {
  const message = (error as ApiError).data?.message;
  return Array.isArray(message) ? message.join(', ') : message || fallback;
};

export const ProfilePage = () => {
  const [profileForm] = Form.useForm<ProfileFormValues>();
  const [passwordForm] = Form.useForm<PasswordFormValues>();
  const { data: user, isLoading, isError } = useGetMeQuery();
  const [updateMe, { isLoading: isSavingProfile }] = useUpdateMeMutation();
  const [uploadAvatar, { isLoading: isUploadingAvatar }] = useUploadMyAvatarMutation();
  const [deleteAvatar, { isLoading: isDeletingAvatar }] = useDeleteMyAvatarMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangeMyPasswordMutation();
  const [deleteMe, { isLoading: isDeletingAccount }] = useDeleteMeMutation();
  const { message } = App.useApp();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      profileForm.setFieldsValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phone: formatUkrainianPhone(user.phone),
      });
    }
  }, [profileForm, user]);

  const onSaveProfile = async (values: ProfileFormValues) => {
    try {
      await updateMe({
        firstName: values.firstName?.trim(),
        lastName: values.lastName?.trim(),
        phone: normalizeUkrainianPhone(values.phone),
      }).unwrap();
      message.success('Профіль оновлено');
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Не вдалося оновити профіль'));
    }
  };

  const onUploadAvatar: UploadProps['onChange'] = ({ file }) => {
    const imageFile = file.originFileObj ?? (file instanceof Blob ? file : undefined);
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('file', imageFile);
    void uploadAvatar(formData)
      .unwrap()
      .then(() => message.success('Фото профілю оновлено'))
      .catch((error: unknown) =>
        message.error(getErrorMessage(error, 'Не вдалося завантажити фото'))
      );
  };

  const onDeleteAvatar = async () => {
    try {
      await deleteAvatar().unwrap();
      message.success('Фото профілю видалено');
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Не вдалося видалити фото'));
    }
  };

  const onChangePassword = async (values: PasswordFormValues) => {
    try {
      const response = await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      }).unwrap();
      message.success(response.message || 'Пароль змінено');
      passwordForm.resetFields();
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Не вдалося змінити пароль'));
    }
  };

  const onDeleteAccount = async () => {
    try {
      await deleteMe().unwrap();
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch(baseApi.util.resetApiState());
      window.dispatchEvent(new Event('auth-change'));
      navigate('/login', { replace: true });
    } catch (error: unknown) {
      message.error(getErrorMessage(error, 'Не вдалося видалити акаунт'));
    }
  };

  if (isLoading) {
    return (
      <Card style={{ maxWidth: 760 }}>
        <Skeleton avatar active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (isError || !user) {
    return <Alert type="error" showIcon title="Не вдалося завантажити профіль" />;
  }

  return (
    <Flex vertical gap={24} style={{ maxWidth: 760 }}>
      <ProfileAvatar
        firstName={user.firstName}
        lastName={user.lastName}
        email={user.email}
        role={user.role}
        status={user.status}
        avatarUrl={user.avatarUrl}
        isUploading={isUploadingAvatar}
        isDeleting={isDeletingAvatar}
        onUpload={onUploadAvatar}
        onDelete={() => void onDeleteAvatar()}
      />
      <ProfileDetailsForm form={profileForm} isSaving={isSavingProfile} onSubmit={onSaveProfile} />
      <ChangePasswordForm
        form={passwordForm}
        isSaving={isChangingPassword}
        onSubmit={onChangePassword}
      />
      <DeleteAccountSection isDeleting={isDeletingAccount} onDelete={() => void onDeleteAccount()} />
    </Flex>
  );
};

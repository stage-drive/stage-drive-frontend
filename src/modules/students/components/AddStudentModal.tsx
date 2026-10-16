import React from 'react';
import type { FormInstance } from 'antd';
import { StudentFormModal, type StudentFormValues } from '@/modules/students/components/StudentFormModal';
import { useGetGroupsQuery } from '@/store/api/endpoints/groupsApi';

interface AddStudentModalProps {
  open: boolean;
  form: FormInstance<StudentFormValues>;
  isSending: boolean;
  onClose: () => void;
  onSubmit: (values: StudentFormValues) => void;
}

export const AddStudentModal: React.FC<AddStudentModalProps> = (props) => {
  const { data } = useGetGroupsQuery(undefined, { skip: !props.open });
  const groupOptions = (data?.groups ?? [])
    .filter((group) => group.status === 'PLANNED' || group.status === 'ACTIVE')
    .map((group) => ({ value: group.id, label: group.name }));

  return (
    <StudentFormModal
      {...props}
      title="Додати студента"
      okText="Надіслати запрошення"
      groupOptions={groupOptions}
    />
  );
};

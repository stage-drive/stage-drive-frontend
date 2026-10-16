import React from 'react';
import type { FormInstance } from 'antd';
import { StudentFormModal, type StudentFormValues } from '@/modules/students/components/StudentFormModal';

interface EditStudentModalProps {
  open: boolean;
  form: FormInstance<StudentFormValues>;
  isSending: boolean;
  studentName?: string;
  onClose: () => void;
  onSubmit: (values: StudentFormValues) => void;
}

export const EditStudentModal: React.FC<EditStudentModalProps> = ({ studentName, ...props }) => (
  <StudentFormModal
    {...props}
    title={studentName ? `Редагувати студента — ${studentName}` : 'Редагувати студента'}
    okText="Зберегти"
    lockEmail
  />
);

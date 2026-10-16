import React, { useEffect, useState } from 'react';
import { Alert, App, Button, Flex, Form, Input, Select, Typography } from 'antd';
import type { TableProps } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { formatUkrainianPhone, normalizeUkrainianPhone } from '@/shared/utils/ukrainianPhone';
import { AddStudentModal } from '@/modules/students/components/AddStudentModal';
import { EditStudentModal } from '@/modules/students/components/EditStudentModal';
import { type StudentFormValues } from '@/modules/students/components/StudentFormModal';
import { StudentsTable } from '@/modules/students/components/StudentsTable';
import {
  useArchiveStudentMutation,
  useCreateStudentMutation,
  useGetStudentQuery,
  useGetStudentsQuery,
  useUpdateStudentMutation,
  type StudentAccountStatus,
  type StudentCategory,
  type StudentListItem,
  type StudentSortBy,
} from '@/store/api/endpoints/studentsApi';

const { Title, Paragraph } = Typography;

const PAGE_SIZE = 20;

const statusOptions: { value: StudentAccountStatus; label: string }[] = [
  { value: 'INVITED', label: 'Запрошений' },
  { value: 'ACTIVE', label: 'Активний' },
  { value: 'BLOCKED', label: 'Заблокований' },
  { value: 'ARCHIVED', label: 'Архів' },
];

const sortFields: StudentSortBy[] = ['firstName', 'lastName', 'email', 'phone', 'status', 'createdAt'];

const isSortField = (value: string): value is StudentSortBy =>
  sortFields.includes(value as StudentSortBy);

export const StudentsPage: React.FC = () => {
  const [addForm] = Form.useForm<StudentFormValues>();
  const [editForm] = Form.useForm<StudentFormValues>();
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<StudentListItem | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<StudentAccountStatus>();
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState<StudentSortBy>('lastName');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const [createStudent, { isLoading: isSending }] = useCreateStudentMutation();
  const [updateStudent, { isLoading: isSaving }] = useUpdateStudentMutation();
  const [archiveStudent] = useArchiveStudentMutation();
  const { data: studentCard, isFetching: isStudentLoading } = useGetStudentQuery(editingStudent?.id ?? '', {
    skip: !editingStudent,
  });
  const { data, isLoading, isFetching, error } = useGetStudentsQuery({
    search,
    status,
    sortBy,
    sortOrder,
    page,
    limit: PAGE_SIZE,
  });
  const { message, modal } = App.useApp();

  const openAddStudentModal = () => {
    addForm.resetFields();
    setIsAddOpen(true);
  };

  const onFinish = async (values: StudentFormValues) => {
    try {
      await createStudent({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phone: values.phone ? normalizeUkrainianPhone(values.phone) : undefined,
        groupId: values.groupId || undefined,
        category: values.category as StudentCategory | undefined,
        transmission: values.transmission as 'MANUAL' | 'AUTOMATIC' | undefined,
      }).unwrap();

      message.success('Студента успішно створено і запрошення надіслано');
      setIsAddOpen(false);
      addForm.resetFields();
    } catch (error: unknown) {
      const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
      message.error(
        Array.isArray(apiMessage)
          ? apiMessage.join(', ')
          : apiMessage || 'Не вдалося надіслати запрошення студенту'
      );
    }
  };

  const openEditStudent = (student: StudentListItem) => {
    editForm.setFieldsValue({
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phone: student.phone ? formatUkrainianPhone(student.phone) : undefined,
      category: undefined,
      transmission: undefined,
    });
    setEditingStudent(student);
  };

  useEffect(() => {
    if (!editingStudent || !studentCard || studentCard.id !== editingStudent.id) return;
    editForm.setFieldsValue({
      category: studentCard.student?.category ?? undefined,
      transmission: studentCard.student?.transmission ?? undefined,
    });
  }, [editingStudent, editForm, studentCard]);

  const onEditFinish = async (values: StudentFormValues) => {
    if (!editingStudent) return;

    const categories: StudentCategory[] = ['A', 'B', 'C', 'D', 'BE', 'CE', 'DE'];
    const category = categories.find((item) => item === values.category) ?? null;

    try {
      await updateStudent({
        id: editingStudent.id,
        body: {
          firstName: values.firstName.trim(),
          lastName: values.lastName.trim(),
          phone: values.phone ? normalizeUkrainianPhone(values.phone) : null,
          category,
          transmission: values.transmission ?? null,
        },
      }).unwrap();
      message.success('Дані студента збережено');
      setEditingStudent(null);
      editForm.resetFields();
    } catch (error: unknown) {
      const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
      message.error(
        Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage || 'Не вдалося зберегти студента'
      );
    }
  };

  const onDeleteStudent = (student: StudentListItem) => {
    modal.confirm({
      title: 'Видалити студента?',
      content: `${student.lastName} ${student.firstName} буде архівовано. Заняття й оплати залишаться в системі.`,
      okText: 'Видалити',
      cancelText: 'Скасувати',
      okButtonProps: { danger: true },
      onOk: async () => {
        setDeletingId(student.id);
        try {
          await archiveStudent(student.id).unwrap();
          message.success('Студента архівовано');
        } catch (error: unknown) {
          const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
          message.error(
            Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage || 'Не вдалося видалити студента'
          );
        } finally {
          setDeletingId(null);
        }
      },
    });
  };

  const onTableChange: TableProps<StudentListItem>['onChange'] = (pagination, _filters, sorter) => {
    setPage(pagination.current ?? 1);

    if (!Array.isArray(sorter) && typeof sorter.field === 'string' && isSortField(sorter.field)) {
      setSortBy(sorter.field);
      setSortOrder(sorter.order === 'descend' ? 'desc' : 'asc');
    }
  };

  return (
    <Flex vertical>
      <Flex align="center" justify="space-between" wrap gap={16}>
        <Flex vertical>
          <Title level={2} style={{ margin: 0 }}>
            Студенти
          </Title>
          <Paragraph type="secondary" style={{ margin: '8px 0 0' }}>
            Учні вашої автошколи
          </Paragraph>
        </Flex>
        <Button type="primary" icon={<PlusOutlined />} onClick={openAddStudentModal}>
          Додати студента
        </Button>
      </Flex>

      <Flex gap={12} wrap style={{ marginTop: 24 }}>
        <Input.Search
          allowClear
          placeholder="Пошук за ПІБ, email або телефоном"
          onSearch={(value) => {
            setSearch(value.trim());
            setPage(1);
          }}
          style={{ width: 320 }}
        />
        <Select
          allowClear
          placeholder="Статус акаунта"
          value={status}
          options={statusOptions}
          onChange={(value) => {
            setStatus(value);
            setPage(1);
          }}
          style={{ width: 200 }}
        />
      </Flex>

      {error && (
        <Alert
          type="error"
          showIcon
          title="Не вдалося завантажити список студентів"
          style={{ marginTop: 24 }}
        />
      )}

      <StudentsTable
        students={data?.students ?? []}
        loading={isLoading || isFetching}
        page={page}
        pageSize={PAGE_SIZE}
        total={data?.pagination.total ?? 0}
        deletingId={deletingId}
        onChange={onTableChange}
        onEdit={openEditStudent}
        onDelete={onDeleteStudent}
      />

      <AddStudentModal
        open={isAddOpen}
        form={addForm}
        isSending={isSending}
        onClose={() => {
          addForm.resetFields();
          setIsAddOpen(false);
        }}
        onSubmit={onFinish}
      />

      <EditStudentModal
        open={Boolean(editingStudent)}
        form={editForm}
        isSending={isSaving || isStudentLoading}
        studentName={editingStudent ? `${editingStudent.lastName} ${editingStudent.firstName}` : undefined}
        onClose={() => {
          editForm.resetFields();
          setEditingStudent(null);
        }}
        onSubmit={onEditFinish}
      />
    </Flex>
  );
};

import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Alert,
  App,
  Breadcrumb,
  Card,
  Descriptions,
  Empty,
  Flex,
  Form,
  Skeleton,
  Tabs,
  Typography,
} from 'antd';
import { AssignGroupModal } from '@/modules/students/components/AssignGroupModal';
import { EditStudentModal } from '@/modules/students/components/EditStudentModal';
import { PracticeAccessModal } from '@/modules/students/components/PracticeAccessModal';
import { StudentCardActions } from '@/modules/students/components/StudentCardActions';
import { StudentCardHeader } from '@/modules/students/components/StudentCardHeader';
import { type StudentFormValues } from '@/modules/students/components/StudentFormModal';
import { TRAINING_STATUS_LABELS, TRANSMISSION_LABELS } from '@/modules/students/constants';
import { getApiErrorMessage } from '@/modules/students/utils/studentActions';
import {
  buildUpdateStudentBody,
  formatProfileDate,
  profileDetailsFromCard,
} from '@/modules/students/utils/studentProfileForm';
import { useGetGroupsQuery } from '@/store/api/endpoints/groupsApi';
import {
  useArchiveStudentMutation,
  useAssignStudentGroupMutation,
  useGetStudentQuery,
  useGrantPracticeAccessMutation,
  useUpdateStudentMutation,
} from '@/store/api/endpoints/studentsApi';
import { useGetOrganizationMembersQuery } from '@/store/api/endpoints/usersApi';
import { formatUkrainianPhone } from '@/shared/utils/ukrainianPhone';

const { Text } = Typography;

export const StudentCardPage = () => {
  const { id = '' } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { message, modal } = App.useApp();
  const [editForm] = Form.useForm<StudentFormValues>();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isGroupOpen, setIsGroupOpen] = useState(false);
  const [isPracticeOpen, setIsPracticeOpen] = useState(false);

  const { data: card, isLoading, isError } = useGetStudentQuery(id, { skip: !id });
  const { data: groupsData } = useGetGroupsQuery();
  const instructorId = card?.student?.instructorId;
  const { data: instructorsData } = useGetOrganizationMembersQuery(
    { role: 'INSTRUCTOR', status: 'ACTIVE', limit: 100 },
    { skip: !instructorId },
  );

  const [updateStudent, { isLoading: isSaving }] = useUpdateStudentMutation();
  const [assignGroup, { isLoading: isAssigningGroup }] = useAssignStudentGroupMutation();
  const [grantPracticeAccess, { isLoading: isGrantingPractice }] =
    useGrantPracticeAccessMutation();
  const [archiveStudent, { isLoading: isArchiving }] = useArchiveStudentMutation();

  useEffect(() => {
    if (!card || !isEditOpen) return;
    editForm.setFieldsValue({
      firstName: card.firstName,
      lastName: card.lastName,
      email: card.email,
      phone: card.phone ? formatUkrainianPhone(card.phone) : undefined,
      category: card.student?.category ?? undefined,
      transmission: card.student?.transmission ?? undefined,
      ...profileDetailsFromCard(card),
    });
  }, [card, editForm, isEditOpen]);

  const groupName = groupsData?.groups.find((group) => group.id === card?.student?.groupId)?.name;
  const instructor = instructorsData?.users.find((user) => user.id === instructorId);

  const onEditFinish = async (values: StudentFormValues) => {
    if (!card) return;

    try {
      await updateStudent({
        id: card.id,
        body: buildUpdateStudentBody(values),
      }).unwrap();
      message.success('Дані студента збережено');
      setIsEditOpen(false);
      editForm.resetFields();
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Не вдалося зберегти студента'));
    }
  };

  const onAssignGroup = async (groupId: string) => {
    if (!card) return;
    try {
      await assignGroup({ id: card.id, body: { groupId } }).unwrap();
      message.success('Студента призначено до групи');
      setIsGroupOpen(false);
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Не вдалося призначити групу'));
    }
  };

  const onPracticeAccess = async (values: { instructorId: string; carId: string }) => {
    if (!card) return;
    try {
      await grantPracticeAccess({ id: card.id, body: values }).unwrap();
      message.success('Доступ до практики відкрито');
      setIsPracticeOpen(false);
    } catch (error: unknown) {
      message.error(getApiErrorMessage(error, 'Не вдалося відкрити доступ до практики'));
    }
  };

  const onArchive = () => {
    if (!card) return;
    modal.confirm({
      title: 'Архівувати студента?',
      content: `${card.lastName} ${card.firstName} буде архівовано. Заняття й оплати залишаться в системі.`,
      okText: 'Архівувати',
      cancelText: 'Скасувати',
      okButtonProps: { danger: true },
      onOk: async () => {
        try {
          await archiveStudent(card.id).unwrap();
          message.success('Студента архівовано');
          navigate('/admin/students');
        } catch (error: unknown) {
          message.error(getApiErrorMessage(error, 'Не вдалося архівувати студента'));
        }
      },
    });
  };

  if (isLoading) {
    return (
      <Card>
        <Skeleton avatar active paragraph={{ rows: 6 }} />
      </Card>
    );
  }

  if (isError || !card) {
    return (
      <Flex vertical gap={16}>
        <Breadcrumb
          items={[
            { title: <Link to="/admin/students">Студенти</Link> },
            { title: 'Картка' },
          ]}
        />
        <Alert type="error" showIcon title="Не вдалося завантажити картку студента" />
      </Flex>
    );
  }

  const profile = card.student;
  const practiceCar = profile?.car;

  return (
    <Flex vertical gap={24}>
      <Breadcrumb
        items={[
          { title: <Link to="/admin/students">Студенти</Link> },
          { title: `${card.lastName} ${card.firstName}` },
        ]}
      />

      <Card>
        <Flex vertical gap={20}>
          <Flex align="flex-start" justify="space-between" gap={16} wrap>
            <StudentCardHeader card={card} />
            <StudentCardActions
              card={card}
              isArchiving={isArchiving}
              onEdit={() => setIsEditOpen(true)}
              onAssignGroup={() => setIsGroupOpen(true)}
              onPracticeAccess={() => setIsPracticeOpen(true)}
              onArchive={onArchive}
            />
          </Flex>

          <Tabs
            items={[
              {
                key: 'main',
                label: 'Основна інформація',
                children: (
                  <Descriptions column={1} bordered size="small">
                    <Descriptions.Item label="Дата створення">
                      {new Date(card.createdAt).toLocaleDateString('uk-UA')}
                    </Descriptions.Item>
                    <Descriptions.Item label="Навчальна група">
                      {groupName ?? (
                        <Text type="secondary">Навчальну групу не призначено</Text>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Дата народження">
                      {formatProfileDate(profile?.birthDate) ?? (
                        <Text type="secondary">Дані ще не заповнені</Text>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Адреса">
                      {profile?.address?.trim() || (
                        <Text type="secondary">Дані ще не заповнені</Text>
                      )}
                    </Descriptions.Item>
                    <Descriptions.Item label="Номер договору">
                      {profile?.contractNumber?.trim() || (
                        <Text type="secondary">Дані ще не заповнені</Text>
                      )}
                    </Descriptions.Item>
                  </Descriptions>
                ),
              },
              {
                key: 'learning',
                label: 'Навчання',
                children: (
                  <Flex vertical gap={16}>
                    <Descriptions column={1} bordered size="small">
                      <Descriptions.Item label="Статус навчання">
                        {profile
                          ? TRAINING_STATUS_LABELS[profile.trainingStatus]
                          : '—'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Категорія">
                        {profile?.category ?? '—'}
                      </Descriptions.Item>
                      <Descriptions.Item label="Коробка передач">
                        {profile?.transmission
                          ? TRANSMISSION_LABELS[profile.transmission]
                          : '—'}
                      </Descriptions.Item>
                    </Descriptions>
                    <Empty description="Теоретичний курс, тести та відвідуваність з’являться після підключення модулів" />
                  </Flex>
                ),
              },
              {
                key: 'practice',
                label: 'Практика',
                children:
                  profile?.instructorId || practiceCar ? (
                    <Descriptions column={1} bordered size="small">
                      <Descriptions.Item label="Інструктор">
                        {instructor
                          ? `${instructor.lastName} ${instructor.firstName}`
                          : profile?.instructorId ?? (
                              <Text type="secondary">Інструктора не призначено</Text>
                            )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Автомобіль">
                        {practiceCar ? (
                          `${practiceCar.plateNumber} · ${practiceCar.category} · ${TRANSMISSION_LABELS[practiceCar.transmission]}`
                        ) : (
                          <Text type="secondary">Автомобіль не призначено</Text>
                        )}
                      </Descriptions.Item>
                      <Descriptions.Item label="Історія занять">
                        <Text type="secondary">Історія практичних занять ще недоступна</Text>
                      </Descriptions.Item>
                    </Descriptions>
                  ) : (
                    <Empty description="Інструктора не призначено" />
                  ),
              },
              {
                key: 'payments',
                label: 'Оплати',
                children: <Empty description="Немає даних про оплату" />,
              },
            ]}
          />
        </Flex>
      </Card>

      <EditStudentModal
        open={isEditOpen}
        form={editForm}
        isSending={isSaving}
        studentName={`${card.lastName} ${card.firstName}`}
        onClose={() => {
          editForm.resetFields();
          setIsEditOpen(false);
        }}
        onSubmit={onEditFinish}
      />

      <AssignGroupModal
        open={isGroupOpen}
        isSending={isAssigningGroup}
        onClose={() => setIsGroupOpen(false)}
        onSubmit={onAssignGroup}
      />

      <PracticeAccessModal
        open={isPracticeOpen}
        isSending={isGrantingPractice}
        category={profile?.category}
        transmission={profile?.transmission}
        onClose={() => setIsPracticeOpen(false)}
        onSubmit={onPracticeAccess}
      />
    </Flex>
  );
};

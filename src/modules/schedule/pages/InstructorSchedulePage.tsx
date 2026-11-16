import { useState } from 'react';
import { Alert, App, Button, Card, Flex, Skeleton, Typography } from 'antd';
import { formatLessonTime } from '@/modules/dashboard/components/formatLessonTime';
import { EditPracticeLessonModal } from '@/modules/schedule/components/EditPracticeLessonModal';
import { RescheduleLessonModal } from '@/modules/schedule/components/RescheduleLessonModal';
import { readLessonActionError, type LessonActionError } from '@/modules/schedule/utils/lessonErrors';
import { useGetInstructorDashboardQuery } from '@/store/api/endpoints/dashboardApi';
import {
  useReschedulePracticeLessonMutation,
  useUpdatePracticeLessonMutation,
} from '@/store/api/endpoints/lessonsApi';

const { Text, Title } = Typography;

interface PracticeLessonItem {
  id: string;
  studentName: string;
  scheduledAt: string;
}

export const InstructorSchedulePage = () => {
  const { message } = App.useApp();
  const { data, isLoading, isError, refetch } = useGetInstructorDashboardQuery();
  const [editing, setEditing] = useState<PracticeLessonItem | null>(null);
  const [moving, setMoving] = useState<PracticeLessonItem | null>(null);
  const [actionError, setActionError] = useState<LessonActionError | null>(null);
  const [updateLesson, { isLoading: isSaving }] = useUpdatePracticeLessonMutation();
  const [rescheduleLesson, { isLoading: isMoving }] = useReschedulePracticeLessonMutation();

  if (isLoading) {
    return (
      <Card>
        <Skeleton active paragraph={{ rows: 4 }} />
      </Card>
    );
  }

  if (isError || !data) {
    return (
      <Alert
        type="error"
        showIcon
        title="Не вдалося завантажити розклад"
        action={
          <Button type="link" size="small" onClick={() => void refetch()}>
            Спробувати ще
          </Button>
        }
      />
    );
  }

  const timezone = data.organization.timezone;

  return (
    <Flex vertical gap={16}>
      <Title level={3} style={{ margin: 0 }}>
        Найближчі практичні заняття
      </Title>
      {data.upcomingLessons.length === 0 ? (
        <Card>
          <Text type="secondary">Найближчих практичних занять немає</Text>
        </Card>
      ) : (
        data.upcomingLessons.map((lesson) => (
          <Card key={lesson.id}>
            <Flex justify="space-between" gap={16} wrap>
              <Flex vertical gap={4}>
                <Text strong>{lesson.studentName}</Text>
                <Text type="secondary">{formatLessonTime(lesson.scheduledAt, timezone)}</Text>
              </Flex>
              <Flex gap={8}>
                <Button onClick={() => setEditing(lesson)}>Редагувати</Button>
                <Button
                  onClick={() => {
                    setActionError(null);
                    setMoving(lesson);
                  }}
                >
                  Перенести
                </Button>
              </Flex>
            </Flex>
          </Card>
        ))
      )}

      <EditPracticeLessonModal
        open={Boolean(editing)}
        isSending={isSaving}
        onClose={() => setEditing(null)}
        onSubmit={async (values) => {
          if (!editing) return;
          try {
            await updateLesson({
              id: editing.id,
              body: {
                durationMin: values.durationMin,
                ...(values.carId ? { carId: values.carId } : {}),
              },
            }).unwrap();
            message.success('Заняття збережено');
            setEditing(null);
          } catch (error: unknown) {
            message.error(readLessonActionError(error, 'Не вдалося зберегти заняття').title);
          }
        }}
      />
      <RescheduleLessonModal
        open={Boolean(moving)}
        isSending={isMoving}
        timezone={timezone}
        scheduledAt={moving?.scheduledAt}
        error={actionError}
        onClose={() => {
          setMoving(null);
          setActionError(null);
        }}
        onSubmit={async (body) => {
          if (!moving) return;
          try {
            await rescheduleLesson({ id: moving.id, body }).unwrap();
            message.success('Заняття перенесено');
            setMoving(null);
            setActionError(null);
          } catch (error: unknown) {
            setActionError(readLessonActionError(error, 'Не вдалося перенести заняття'));
          }
        }}
      />
    </Flex>
  );
};

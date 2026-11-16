import { useState } from 'react';
import { Alert, App, Button, Card, Flex, Skeleton, Typography } from 'antd';
import { EditTheoryLessonModal } from '@/modules/schedule/components/EditTheoryLessonModal';
import { RescheduleLessonModal } from '@/modules/schedule/components/RescheduleLessonModal';
import { readLessonActionError, type LessonActionError } from '@/modules/schedule/utils/lessonErrors';
import { formatLessonTime } from '@/modules/dashboard/components/formatLessonTime';
import {
  useRescheduleTheoryLessonMutation,
  useUpdateTheoryLessonMutation,
} from '@/store/api/endpoints/lessonsApi';
import { useGetTeacherDashboardQuery } from '@/store/api/endpoints/dashboardApi';

const { Text, Title } = Typography;

interface TheoryLessonItem {
  id: string;
  topic: string;
  groupName: string;
  scheduledAt: string;
}

export const TeacherSchedulePage = () => {
  const { message } = App.useApp();
  const { data, isLoading, isError, refetch } = useGetTeacherDashboardQuery();
  const [editing, setEditing] = useState<TheoryLessonItem | null>(null);
  const [moving, setMoving] = useState<TheoryLessonItem | null>(null);
  const [actionError, setActionError] = useState<LessonActionError | null>(null);
  const [updateLesson, { isLoading: isSaving }] = useUpdateTheoryLessonMutation();
  const [rescheduleLesson, { isLoading: isMoving }] = useRescheduleTheoryLessonMutation();

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
        Найближчі теоретичні заняття
      </Title>
      {data.upcomingLessons.length === 0 ? (
        <Card>
          <Text type="secondary">Найближчих занять немає</Text>
        </Card>
      ) : (
        data.upcomingLessons.map((lesson) => (
          <Card key={lesson.id}>
            <Flex justify="space-between" gap={16} wrap>
              <Flex vertical gap={4}>
                <Text strong>{lesson.groupName}</Text>
                <Text>{lesson.topic}</Text>
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

      <EditTheoryLessonModal
        open={Boolean(editing)}
        isSending={isSaving}
        topic={editing?.topic}
        onClose={() => setEditing(null)}
        onSubmit={async (body) => {
          if (!editing) return;
          try {
            await updateLesson({ id: editing.id, body }).unwrap();
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

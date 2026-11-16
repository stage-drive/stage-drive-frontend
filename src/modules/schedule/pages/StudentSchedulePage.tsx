import { Alert, Button, Card, Flex, Skeleton, Typography } from 'antd';
import { formatLessonTime } from '@/modules/dashboard/components/formatLessonTime';
import { useGetStudentDashboardQuery } from '@/store/api/endpoints/dashboardApi';
import { useGetMyStudentProfileQuery } from '@/store/api/endpoints/studentsApi';

const { Text, Title } = Typography;

export const StudentSchedulePage = () => {
  const { data, isLoading, isError, refetch } = useGetStudentDashboardQuery();
  const { data: profile } = useGetMyStudentProfileQuery();

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
  const practiceClosed = profile?.student && !profile.student.instructorId;

  return (
    <Flex vertical gap={16}>
      <Title level={3} style={{ margin: 0 }}>
        Мої заняття
      </Title>
      {practiceClosed ? (
        <Alert
          type="info"
          showIcon
          title="Немає доступу. Пройдіть курс теорії та отримайте допуск до практики."
        />
      ) : null}
      {data.upcomingLessons.length === 0 ? (
        <Card>
          <Text type="secondary">Найближчих занять немає</Text>
        </Card>
      ) : (
        data.upcomingLessons.map((lesson) => (
          <Card key={lesson.id}>
            <Flex vertical gap={4}>
              <Text strong>{lesson.groupName}</Text>
              <Text>{lesson.topic}</Text>
              <Text type="secondary">{formatLessonTime(lesson.scheduledAt, timezone)}</Text>
            </Flex>
          </Card>
        ))
      )}
    </Flex>
  );
};

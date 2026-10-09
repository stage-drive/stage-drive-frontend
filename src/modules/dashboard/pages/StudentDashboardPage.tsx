import { Alert, Col, Flex, List, Row, Skeleton, Space, Typography } from 'antd';
import { BookOutlined, CalendarOutlined } from '@ant-design/icons';
import { DashboardWidget } from '../components/common/DashboardWidget';
import { StatsCard } from '../components/common/StatsCard';
import { useGetStudentDashboardQuery } from '../../../store/api/endpoints/dashboardApi';

const { Title, Text } = Typography;

const formatLessonTime = (value: string, timezone: string) =>
  new Date(value).toLocaleString('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  });

export const StudentDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useGetStudentDashboardQuery();

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (isError || !data) {
    return (
      <Alert
        type="error"
        showIcon
        message="Не вдалося завантажити панель студента"
        action={<a onClick={() => void refetch()}>Спробувати ще</a>}
      />
    );
  }

  const nextLesson = data.upcomingLessons[0];

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Flex vertical gap={4}>
        <Title level={2} style={{ margin: 0 }}>
          Доброго дня, {data.student.firstName}!
        </Title>
        <Text type="secondary">Вітаємо, у автошколі {data.organization.name}</Text>
      </Flex>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <StatsCard title="Мої групи" value={data.stats.groupsTotal} icon={<BookOutlined />} />
        </Col>
        <Col xs={24} sm={12}>
          <StatsCard
            title="Найближчі заняття"
            value={data.stats.upcomingLessonsTotal}
            icon={<CalendarOutlined />}
          />
        </Col>
      </Row>
      <DashboardWidget title="Найближче заняття">
        {nextLesson ? (
          <List.Item>
            <List.Item.Meta title={nextLesson.groupName} description={nextLesson.topic} />
            <Text type="secondary">
              {formatLessonTime(nextLesson.scheduledAt, data.organization.timezone)}
            </Text>
          </List.Item>
        ) : (
          <Text type="secondary">У вас поки немає запланованих занять.</Text>
        )}
      </DashboardWidget>
      <DashboardWidget title="Мої групи">
        <List
          dataSource={data.groups}
          locale={{ emptyText: 'Ви поки не зараховані до групи' }}
          renderItem={(group) => (
            <List.Item>
              <List.Item.Meta title={group.name} description={`Викладач: ${group.teacherName}`} />
              <Text type="secondary">{group.status}</Text>
            </List.Item>
          )}
        />
      </DashboardWidget>
    </Space>
  );
};

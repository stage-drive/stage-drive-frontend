import { Alert, Col, Flex, List, Row, Skeleton, Space, Typography } from 'antd';
import { TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { DashboardWidget } from '../components/common/DashboardWidget';
import { StatsCard } from '../components/common/StatsCard';
import { useGetInstructorDashboardQuery } from '../../../store/api/endpoints/dashboardApi';

const { Title, Text } = Typography;

const formatLessonTime = (value: string, timezone: string) =>
  new Date(value).toLocaleString('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  });

export const InstructorDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useGetInstructorDashboardQuery();

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (isError || !data) {
    return (
      <Alert
        type="error"
        showIcon
        message="Не вдалося завантажити панель інструктора"
        action={<a onClick={() => void refetch()}>Спробувати ще</a>}
      />
    );
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Flex vertical gap={4}>
        <Title level={2} style={{ margin: 0 }}>
          Доброго дня, {data.instructor.firstName}!
        </Title>
        <Text type="secondary">{data.organization.name}</Text>
      </Flex>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12}>
          <StatsCard
            title="Студенти з майбутніми заняттями"
            value={data.stats.studentsTotal}
            icon={<TeamOutlined />}
          />
        </Col>
        <Col xs={24} sm={12}>
          <StatsCard
            title="Найближчі заняття"
            value={data.stats.upcomingLessonsTotal}
            icon={<CalendarOutlined />}
          />
        </Col>
      </Row>
      <DashboardWidget title="Найближчі практичні заняття">
        <List
          dataSource={data.upcomingLessons}
          locale={{ emptyText: 'Найближчих практичних занять немає' }}
          renderItem={(lesson) => (
            <List.Item>
              <List.Item.Meta title={lesson.studentName} />
              <Text type="secondary">
                {formatLessonTime(lesson.scheduledAt, data.organization.timezone)}
              </Text>
            </List.Item>
          )}
        />
      </DashboardWidget>
    </Space>
  );
};

import { Alert, Col, Flex, List, Row, Skeleton, Space, Typography } from 'antd';
import { BookOutlined, TeamOutlined, CalendarOutlined } from '@ant-design/icons';
import { DashboardWidget } from '../components/common/DashboardWidget';
import { StatsCard } from '../components/common/StatsCard';
import { useGetTeacherDashboardQuery } from '../../../store/api/endpoints/dashboardApi';

const { Title, Text } = Typography;

const formatLessonTime = (value: string, timezone: string) =>
  new Date(value).toLocaleString('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  });

export const TeacherDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useGetTeacherDashboardQuery();

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;
  if (isError || !data) {
    return (
      <Alert
        type="error"
        showIcon
        message="Не вдалося завантажити панель викладача"
        action={<a onClick={() => void refetch()}>Спробувати ще</a>}
      />
    );
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Flex vertical gap={4}>
        <Title level={2} style={{ margin: 0 }}>
          Доброго дня, {data.teacher.firstName}!
        </Title>
        <Text type="secondary">{data.organization.name}</Text>
      </Flex>
      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard title="Мої групи" value={data.stats.groupsTotal} icon={<BookOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard title="Студенти" value={data.stats.studentsTotal} icon={<TeamOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard
            title="Найближчі заняття"
            value={data.stats.upcomingLessonsTotal}
            icon={<CalendarOutlined />}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={12}>
          <DashboardWidget title="Мої заняття">
            <List
              dataSource={data.upcomingLessons}
              locale={{ emptyText: 'Найближчих занять немає' }}
              renderItem={(lesson) => (
                <List.Item>
                  <List.Item.Meta title={lesson.groupName} description={lesson.topic} />
                  <Text type="secondary">
                    {formatLessonTime(lesson.scheduledAt, data.organization.timezone)}
                  </Text>
                </List.Item>
              )}
            />
          </DashboardWidget>
        </Col>
        <Col xs={24} lg={12}>
          <DashboardWidget title="Мої групи">
            <List
              dataSource={data.groups}
              locale={{ emptyText: 'Груп поки немає' }}
              renderItem={(group) => (
                <List.Item>
                  <List.Item.Meta
                    title={group.name}
                    description={`Студентів: ${group.studentsCount}`}
                  />
                  <Text type="secondary">{group.status}</Text>
                </List.Item>
              )}
            />
          </DashboardWidget>
        </Col>
      </Row>
    </Space>
  );
};

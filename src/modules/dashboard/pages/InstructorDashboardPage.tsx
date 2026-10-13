import { Alert, Button, Flex, Row, Typography } from 'antd';
import { CalendarOutlined, TeamOutlined } from '@ant-design/icons';
import { DashboardCol } from '@/modules/dashboard/components/DashboardCol';
import { DashboardPageSkeleton } from '@/modules/dashboard/components/DashboardPageSkeleton';
import { DashboardRecord, DashboardRecordList } from '@/modules/dashboard/components/DashboardRecord';
import { DashboardWidget } from '@/modules/dashboard/components/DashboardWidget';
import { StatsCard } from '@/modules/dashboard/components/StatsCard';
import { formatLessonTime } from '@/modules/dashboard/components/formatLessonTime';
import { OrganizationLogo } from '@/modules/organization/components/OrganizationLogo';
import { useGetInstructorDashboardQuery } from '@/store/api/endpoints/dashboardApi';

const { Title, Text } = Typography;

export const InstructorDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useGetInstructorDashboardQuery();

  if (isLoading) return <DashboardPageSkeleton cards={2} />;

  if (isError || !data) {
    return (
      <Alert
        type="error"
        showIcon
        title="Не вдалося завантажити панель інструктора"
        action={
          <Button type="link" size="small" onClick={() => void refetch()}>
            Спробувати ще
          </Button>
        }
      />
    );
  }

  return (
    <Flex vertical gap={24}>
      <Flex align="center" gap={16}>
        <OrganizationLogo logoUrl={data.organization.logoUrl} name={data.organization.name} />
        <Flex vertical gap={4}>
          <Title level={3} style={{ margin: 0 }}>
            Доброго дня, {data.instructor.firstName}!
          </Title>
          <Text type="secondary">{data.organization.name}</Text>
        </Flex>
      </Flex>

      <Row gutter={[16, 16]}>
        <DashboardCol xs={24} sm={12}>
          <StatsCard
            title="Студенти з майбутніми заняттями"
            value={data.stats.studentsTotal}
            icon={<TeamOutlined />}
            color="#0052FF"
          />
        </DashboardCol>
        <DashboardCol xs={24} sm={12}>
          <StatsCard
            title="Найближчі заняття"
            value={data.stats.upcomingLessonsTotal}
            icon={<CalendarOutlined />}
            color="#FAAD14"
          />
        </DashboardCol>
      </Row>

      <DashboardWidget title="Найближчі практичні заняття">
        <DashboardRecordList
          items={data.upcomingLessons}
          rowKey={(lesson) => lesson.id}
          emptyText="Найближчих практичних занять немає"
          renderItem={(lesson, divided) => (
            <DashboardRecord
              divided={divided}
              icon={<TeamOutlined />}
              iconColor="#0052FF"
              title={lesson.studentName}
              description={formatLessonTime(lesson.scheduledAt, data.organization.timezone)}
            />
          )}
        />
      </DashboardWidget>
    </Flex>
  );
};

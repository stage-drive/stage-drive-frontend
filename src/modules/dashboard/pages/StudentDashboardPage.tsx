import { Alert, Avatar, Button, Empty, Flex, Row, Typography } from 'antd';
import { BookOutlined, CalendarOutlined } from '@ant-design/icons';
import { DashboardCol } from '@/modules/dashboard/components/DashboardCol';
import { DashboardPageSkeleton } from '@/modules/dashboard/components/DashboardPageSkeleton';
import { DashboardRecord, DashboardRecordList } from '@/modules/dashboard/components/DashboardRecord';
import { DashboardWidget } from '@/modules/dashboard/components/DashboardWidget';
import { GroupStatusTag } from '@/modules/dashboard/components/GroupStatusTag';
import { StatsCard } from '@/modules/dashboard/components/StatsCard';
import { formatLessonTime } from '@/modules/dashboard/components/formatLessonTime';
import { OrganizationLogo } from '@/modules/organization/components/OrganizationLogo';
import { useGetStudentDashboardQuery } from '@/store/api/endpoints/dashboardApi';

const { Title, Text } = Typography;

export const StudentDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useGetStudentDashboardQuery();

  if (isLoading) return <DashboardPageSkeleton cards={2} />;

  if (isError || !data) {
    return (
      <Alert
        type="error"
        showIcon
        title="Не вдалося завантажити панель студента"
        action={
          <Button type="link" size="small" onClick={() => void refetch()}>
            Спробувати ще
          </Button>
        }
      />
    );
  }

  const nextLesson = data.upcomingLessons[0];

  return (
    <Flex vertical gap={24}>
      <Flex align="center" gap={16}>
        <OrganizationLogo logoUrl={data.organization.logoUrl} name={data.organization.name} />
        <Flex vertical gap={4}>
          <Title level={3} style={{ margin: 0 }}>
            Доброго дня, {data.student.firstName}!
          </Title>
          <Text type="secondary">Вітаємо, у автошколі {data.organization.name}</Text>
        </Flex>
      </Flex>

      <Row gutter={[16, 16]}>
        <DashboardCol xs={24} sm={12}>
          <StatsCard
            title="Мої групи"
            value={data.stats.groupsTotal}
            icon={<BookOutlined />}
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

      <DashboardWidget title="Найближче заняття">
        {nextLesson ? (
          <Flex align="center" gap={16}>
            <Avatar size={48} icon={<CalendarOutlined />} style={{ backgroundColor: '#0052FF' }} />
            <Flex vertical gap={2}>
              <Text strong>{nextLesson.groupName}</Text>
              <Text>{nextLesson.topic}</Text>
              <Text type="secondary">
                {formatLessonTime(nextLesson.scheduledAt, data.organization.timezone)}
              </Text>
            </Flex>
          </Flex>
        ) : (
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="У вас поки немає запланованих занять."
          />
        )}
      </DashboardWidget>

      <DashboardWidget title="Мої групи">
        <DashboardRecordList
          items={data.groups}
          rowKey={(group) => group.id}
          emptyText="Ви поки не зараховані до групи"
          renderItem={(group, divided) => (
            <DashboardRecord
              divided={divided}
              icon={<BookOutlined />}
              iconColor="#52C41A"
              title={group.name}
              description={`Викладач: ${group.teacherName}`}
              extra={<GroupStatusTag status={group.status} />}
            />
          )}
        />
      </DashboardWidget>
    </Flex>
  );
};

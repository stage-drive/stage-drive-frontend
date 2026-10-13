import { Alert, Button, Flex, Row, Statistic, Tag, Typography } from 'antd';
import { BookOutlined, CarOutlined, TeamOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { DashboardCol } from '@/modules/dashboard/components/DashboardCol';
import { DashboardPageSkeleton } from '@/modules/dashboard/components/DashboardPageSkeleton';
import { DashboardWidget } from '@/modules/dashboard/components/DashboardWidget';
import { MetricList } from '@/modules/dashboard/components/MetricList';
import { StatsCard } from '@/modules/dashboard/components/StatsCard';
import { OrganizationLogo } from '@/modules/organization/components/OrganizationLogo';
import { useGetOwnerDashboardQuery } from '@/store/api/endpoints/dashboardApi';

const { Title, Text } = Typography;

export const OwnerDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useGetOwnerDashboardQuery();

  if (isLoading) return <DashboardPageSkeleton cards={4} />;

  if (isError || !data) {
    return (
      <Alert
        type="error"
        showIcon
        title="Не вдалося завантажити дані автошколи"
        action={
          <Button type="link" size="small" onClick={() => void refetch()}>
            Спробувати ще
          </Button>
        }
      />
    );
  }

  const invitationTotal = data.invitations.pending + data.invitations.expired;

  return (
    <Flex vertical gap={24}>
      <Flex align="center" justify="space-between" gap={16} wrap>
        <Flex align="center" gap={16} style={{ minWidth: 0 }}>
          <OrganizationLogo
            logoUrl={data.organization.logoUrl}
            name={data.organization.name}
          />
          <Flex vertical gap={4}>
            <Title level={3} style={{ margin: 0 }}>
              {data.organization.name}
            </Title>
            <Text type="secondary">Загальний огляд автошколи</Text>
          </Flex>
        </Flex>
        <Tag color={data.organization.status === 'ACTIVE' ? 'success' : 'error'}>
          {data.organization.status === 'ACTIVE' ? 'Автошкола активна' : 'Автошколу заблоковано'}
        </Tag>
      </Flex>

      <Row gutter={[16, 16]}>
        <DashboardCol xs={24} sm={12} lg={6}>
          <StatsCard
            title="Адміністратори"
            value={data.users.byRole.ADMIN}
            icon={<UserSwitchOutlined />}
            color="#0052FF"
          />
        </DashboardCol>
        <DashboardCol xs={24} sm={12} lg={6}>
          <StatsCard
            title="Студенти"
            value={data.users.byRole.STUDENT}
            icon={<TeamOutlined />}
            color="#13C2C2"
          />
        </DashboardCol>
        <DashboardCol xs={24} sm={12} lg={6}>
          <StatsCard
            title="Викладачі"
            value={data.users.byRole.TEACHER}
            icon={<BookOutlined />}
            color="#52C41A"
          />
        </DashboardCol>
        <DashboardCol xs={24} sm={12} lg={6}>
          <StatsCard
            title="Інструктори"
            value={data.users.byRole.INSTRUCTOR}
            icon={<CarOutlined />}
            color="#FAAD14"
          />
        </DashboardCol>
      </Row>

      <Row gutter={[16, 16]}>
        <DashboardCol xs={24} md={12}>
          <DashboardWidget title="Користувачі автошколи">
            <Flex vertical gap={20}>
              <Statistic title="Всього" value={data.users.total} />
              <MetricList
                total={data.users.total}
                items={[
                  { label: 'Активні', value: data.users.byStatus.ACTIVE, color: '#52C41A' },
                  { label: 'Запрошені', value: data.users.byStatus.INVITED, color: '#0052FF' },
                  { label: 'Заблоковані', value: data.users.byStatus.BLOCKED, color: '#f52629' },
                  { label: 'Архівні', value: data.users.byStatus.ARCHIVED, color: '#8c8c8c' },
                ]}
              />
            </Flex>
          </DashboardWidget>
        </DashboardCol>
        <DashboardCol xs={24} md={12}>
          <DashboardWidget title="Запрошення">
            <MetricList
              total={invitationTotal}
              items={[
                { label: 'Очікують активації', value: data.invitations.pending, color: '#FAAD14' },
                { label: 'Прострочені', value: data.invitations.expired, color: '#f52629' },
              ]}
            />
          </DashboardWidget>
        </DashboardCol>
      </Row>
    </Flex>
  );
};

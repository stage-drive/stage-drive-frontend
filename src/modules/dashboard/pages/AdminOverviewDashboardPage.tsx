import { Alert, Col, Flex, Row, Skeleton, Space, Typography } from 'antd';
import { TeamOutlined, SolutionOutlined, CarOutlined, MailOutlined } from '@ant-design/icons';
import { DashboardWidget } from '../components/common/DashboardWidget';
import { StatsCard } from '../components/common/StatsCard';
import { useGetAdminDashboardQuery } from '../../../store/api/endpoints/dashboardApi';

const { Title, Text } = Typography;

export const AdminOverviewDashboardPage = () => {
  const { data, isLoading, isError, refetch } = useGetAdminDashboardQuery();

  if (isLoading) return <Skeleton active paragraph={{ rows: 6 }} />;

  if (isError || !data) {
    return (
      <Alert
        type="error"
        showIcon
        message="Не вдалося завантажити дані автошколи"
        action={<a onClick={() => void refetch()}>Спробувати ще</a>}
      />
    );
  }

  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      <Flex vertical gap={4}>
        <Title level={2} style={{ margin: 0 }}>
          {data.organization.name}
        </Title>
        <Text type="secondary">Операційний огляд автошколи</Text>
      </Flex>

      <Row gutter={[16, 16]}>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard title="Студенти" value={data.users.byRole.STUDENT} icon={<TeamOutlined />} />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard
            title="Викладачі"
            value={data.users.byRole.TEACHER}
            icon={<SolutionOutlined />}
          />
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <StatsCard
            title="Інструктори"
            value={data.users.byRole.INSTRUCTOR}
            icon={<CarOutlined />}
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <DashboardWidget title="Статус учасників">
            <Flex justify="space-between">
              <Text>Всього</Text>
              <Text strong>{data.users.total}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Активні</Text>
              <Text strong>{data.users.byStatus.ACTIVE}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Запрошені</Text>
              <Text strong>{data.users.byStatus.INVITED}</Text>
            </Flex>
            <Flex justify="space-between">
              <Text>Заблоковані</Text>
              <Text strong>{data.users.byStatus.BLOCKED}</Text>
            </Flex>
          </DashboardWidget>
        </Col>
        <Col xs={24} md={12}>
          <DashboardWidget title="Запрошення">
            <Flex align="center" gap={8}>
              <MailOutlined />
              <Text>
                Очікують активації: <Text strong>{data.invitations.pending}</Text>
              </Text>
            </Flex>
            <Flex align="center" gap={8}>
              <MailOutlined />
              <Text>
                Прострочені: <Text strong>{data.invitations.expired}</Text>
              </Text>
            </Flex>
          </DashboardWidget>
        </Col>
      </Row>
    </Space>
  );
};

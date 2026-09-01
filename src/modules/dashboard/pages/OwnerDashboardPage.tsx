import { Row, Col, Space } from 'antd';
import { TeamOutlined, UserSwitchOutlined } from '@ant-design/icons';
import { StatsCard } from '../components/common/StatsCard';
import { DashboardWidget } from '../components/common/DashboardWidget';
import { SystemEventsWidget } from '../components/owner/SystemEventsWidget';

const mockEvents = [
  {
    id: 1,
    text: 'Сформовано нову групу «Категорія B - Вечірня»',
    time: '10 хв тому',
    type: 'info' as const,
  },
  {
    id: 2,
    text: 'Отримано нову оплату: 15,000 грн (Студент: Олег К.)',
    time: '25 хв тому',
    type: 'success' as const,
  },
  {
    id: 3,
    text: 'Завершено ТО авто Hyundai ix35 (КА1234ВЕ)',
    time: '1 год тому',
    type: 'warning' as const,
  },
];

export const OwnerDashboardPage = () => {
  return (
    <Space orientation="vertical" size="large" style={{ width: '100%' }}>
      {/*StatsCard */}
      <Row gutter={[16, 16]}>
        <Col span={12}>
          <StatsCard title="Адміністратори" value={4} icon={<UserSwitchOutlined />} />
        </Col>
        <Col span={12}>
          <StatsCard title="Студенти" value={248} icon={<TeamOutlined />} color="#0052FF" />
        </Col>
      </Row>

      {/* Widget */}
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <DashboardWidget title="Важливі системні події">
            <SystemEventsWidget events={mockEvents} />
          </DashboardWidget>
        </Col>
      </Row>
    </Space>
  );
};

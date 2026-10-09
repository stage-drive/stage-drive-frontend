import { BaseLayout } from '../BaseLayout';
import {
  HomeOutlined,
  UserSwitchOutlined,
  BarChartOutlined,
  BellOutlined,
  UserOutlined,
  BankOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const ownerMenuItems: MenuProps['items'] = [
  { key: '/owner/dashboard', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/owner/admins', icon: <UserSwitchOutlined />, label: 'Адміністратори' },
  { key: '/owner/branches', icon: <BarChartOutlined />, label: 'Філії / Статистика' },
  { key: '/owner/notifications', icon: <BellOutlined />, label: 'Сповіщення' },

  { type: 'divider' },
  { key: '/owner/profile', icon: <UserOutlined />, label: 'Профіль' },
  { key: '/owner/school-settings', icon: <BankOutlined />, label: 'Автошкола' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const OwnerLayout: React.FC = () => (
  <BaseLayout roleTitle="Панель Власника" menuItems={ownerMenuItems} routePrefix="/owner" />
);

export default OwnerLayout;

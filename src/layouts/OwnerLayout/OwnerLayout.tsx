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
  { key: '/', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/admins', icon: <UserSwitchOutlined />, label: 'Адміністратори' },
  { key: '/branches', icon: <BarChartOutlined />, label: 'Філії / Статистика' },
  { key: '/notifications', icon: <BellOutlined />, label: 'Сповіщення' },
  
  { type: 'divider' }, 
  { key: '/profile', icon: <UserOutlined />, label: 'Профіль' },
  { key: '/school-settings', icon: <BankOutlined />, label: 'Автошкола' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const OwnerLayout: React.FC = () => (
  <BaseLayout roleTitle="Панель Власника" menuItems={ownerMenuItems} />
);

export default OwnerLayout;
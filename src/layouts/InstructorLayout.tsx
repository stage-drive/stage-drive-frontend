import type { MenuProps } from 'antd';
import {
  HomeOutlined,
  CalendarOutlined,
  CarOutlined,
  TeamOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { BaseLayout } from '@/layouts/BaseLayout';

const instructorMenuItems: MenuProps['items'] = [
  { key: '/instructor/dashboard', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/instructor/schedule', icon: <CalendarOutlined />, label: 'Мій розклад' },
  { key: '/instructor/practice', icon: <CarOutlined />, label: 'Практичні заняття' },
  { key: '/instructor/my-students', icon: <TeamOutlined />, label: 'Мої студенти' },
  { key: '/instructor/notifications', icon: <BellOutlined />, label: 'Сповіщення' },

  { type: 'divider' },
  { key: '/instructor/profile', icon: <UserOutlined />, label: 'Профіль' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const InstructorLayout = () => (
  <BaseLayout roleTitle="Інструктор" menuItems={instructorMenuItems} routePrefix="/instructor" />
);

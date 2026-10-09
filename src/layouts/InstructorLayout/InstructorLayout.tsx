import type { MenuProps } from 'antd';
import { BaseLayout } from '../BaseLayout';
import {
  HomeOutlined,
  CalendarOutlined,
  CarOutlined,
  TeamOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';

const instructorMenuItems: MenuProps['items'] = [
  { key: '/instructor/dashboard', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/instructor/schedule', icon: <CalendarOutlined />, label: 'Мій розклад' },
  { key: '/instructor/my-car', icon: <CarOutlined />, label: 'Практичні заняття' },
  { key: '/instructor/my-students', icon: <TeamOutlined />, label: 'Мої студенти' },
  { key: '/instructor/notifications', icon: <BellOutlined />, label: 'Сповіщення' },

  { type: 'divider' },
  { key: '/instructor/profile', icon: <UserOutlined />, label: 'Профіль' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const InstructorLayout = () => (
  <BaseLayout
    roleTitle="Інструктор"
    menuItems={instructorMenuItems}
    profilePath="/instructor/profile"
  />
);

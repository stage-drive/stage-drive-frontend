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
  { key: '/', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/schedule', icon: <CalendarOutlined />, label: 'Мій розклад' },
  { key: '/my-car', icon: <CarOutlined />, label: 'Практичні заняття' },
  { key: '/my-students', icon: <TeamOutlined />, label: 'Мої студенти' },
  { key: '/notifications', icon: <BellOutlined />, label: 'Сповіщення' },

  { type: 'divider' },
  { key: '/profile', icon: <UserOutlined />, label: 'Профіль' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const InstructorLayout = () => (
  <BaseLayout roleTitle="Інструктор" menuItems={instructorMenuItems} />
);

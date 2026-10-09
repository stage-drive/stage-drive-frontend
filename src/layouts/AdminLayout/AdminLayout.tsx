import { BaseLayout } from '../BaseLayout';
import {
  HomeOutlined,
  UserOutlined,
  TeamOutlined,
  SolutionOutlined,
  CarOutlined,
  CalendarOutlined,
  BookOutlined,
  TableOutlined,
  GroupOutlined,
  DollarOutlined,
  BellOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const adminMenuItems: MenuProps['items'] = [
  { key: '/admin/dashboard', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/admin/users', icon: <UserOutlined />, label: 'Користувачі' },
  { key: '/admin/students', icon: <TeamOutlined />, label: 'Студенти' },
  { key: '/admin/groups', icon: <SolutionOutlined />, label: 'Навчальні групи' },
  { key: '/admin/cars', icon: <CarOutlined />, label: 'Автопарк' },
  { key: '/admin/schedule', icon: <CalendarOutlined />, label: 'Розклад' },
  { key: '/admin/theory', icon: <BookOutlined />, label: 'Теоретичний курс' },
  { key: '/admin/practice', icon: <TableOutlined />, label: 'Практичні заняття' },
  { key: '/admin/topics', icon: <GroupOutlined />, label: 'Теми' },
  { key: '/admin/payments', icon: <DollarOutlined />, label: 'Оплата' },
  { key: '/admin/notifications', icon: <BellOutlined />, label: 'Сповіщення' },

  { type: 'divider' },
  { key: '/admin/profile', icon: <UserOutlined />, label: 'Профіль' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const AdminLayout = () => (
  <BaseLayout roleTitle="Адміністратор" menuItems={adminMenuItems} routePrefix="/admin" />
);

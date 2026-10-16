import {
  HomeOutlined,
  CalendarOutlined,
  BookOutlined,
  FileTextOutlined,
  CarOutlined,
  RiseOutlined,
  DollarOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { BaseLayout } from '@/layouts/BaseLayout';

const studentMenuItems: MenuProps['items'] = [
  { key: '/student/dashboard', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/student/schedule', icon: <CalendarOutlined />, label: 'Мій розклад' },
  { key: '/student/theory', icon: <BookOutlined />, label: 'Теоретичний курс' },
  { key: '/student/tests', icon: <FileTextOutlined />, label: 'Тести' },
  { key: '/student/practice', icon: <CarOutlined />, label: 'Практичні заняття' },
  { key: '/student/progress', icon: <RiseOutlined />, label: 'Мій прогрес' },
  { key: '/student/payments', icon: <DollarOutlined />, label: 'Оплати' },
  { key: '/student/notifications', icon: <BellOutlined />, label: 'Сповіщення' },
  { key: '/student/profile', icon: <UserOutlined />, label: 'Профіль' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const StudentLayout = () => (
  <BaseLayout roleTitle="Студент" menuItems={studentMenuItems} routePrefix="/student" />
);

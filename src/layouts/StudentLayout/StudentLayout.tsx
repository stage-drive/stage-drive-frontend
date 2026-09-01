import { BaseLayout } from '../BaseLayout';
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

const studentMenuItems: MenuProps['items'] = [
  { key: '/', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/schedule', icon: <CalendarOutlined />, label: 'Мій розклад' },
  { key: '/theory', icon: <BookOutlined />, label: 'Теоретичний курс' },
  { key: '/tests', icon: <FileTextOutlined />, label: 'Тести' },
  { key: '/practice', icon: <CarOutlined />, label: 'Практичні заняття' },
  { key: '/progress', icon: <RiseOutlined />, label: 'Мій прогрес' },
  { key: '/payments', icon: <DollarOutlined />, label: 'Оплати' },
  { key: '/notifications', icon: <BellOutlined />, label: 'Сповіщення' },

  { type: 'divider' },
  { key: '/profile', icon: <UserOutlined />, label: 'Профіль' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const StudentLayout = () => <BaseLayout roleTitle="Студент" menuItems={studentMenuItems} />;

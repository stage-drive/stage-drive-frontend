import { BaseLayout } from '../BaseLayout';
import {
  HomeOutlined, UserOutlined, TeamOutlined, SolutionOutlined,
  CarOutlined, CalendarOutlined, BookOutlined, FieldBinaryOutlined,
  GroupOutlined, DollarOutlined, BellOutlined, LogoutOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';

const adminMenuItems: MenuProps['items'] = [
  { key: '/', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/users', icon: <UserOutlined />, label: 'Користувачі' },
  { key: '/students', icon: <TeamOutlined />, label: 'Студенти' },
  { key: '/groups', icon: <SolutionOutlined />, label: 'Навчальні групи' },
  { key: '/cars', icon: <CarOutlined />, label: 'Автопарк' },
  { key: '/schedule', icon: <CalendarOutlined />, label: 'Розклад' },
  { key: '/theory', icon: <BookOutlined />, label: 'Теоретичний курс' },
  { key: '/practice', icon: <FieldBinaryOutlined />, label: 'Практичні заняття' },
  { key: '/topics', icon: <GroupOutlined />, label: 'Теми' },
  { key: '/payments', icon: <DollarOutlined />, label: 'Оплата' },
  { key: '/notifications', icon: <BellOutlined />, label: 'Сповіщення' },
 
    { type: 'divider' }, 
    { key: '/profile', icon: <UserOutlined />, label: 'Профіль' },
    { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const AdminLayout = () => <BaseLayout roleTitle="Адміністратор" menuItems={adminMenuItems} />;
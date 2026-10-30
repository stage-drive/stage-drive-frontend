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
import type { AppNavItem } from '@/layouts/types';

const instructorMenuItems: AppNavItem[] = [
  {
    key: '/instructor/dashboard',
    icon: <HomeOutlined />,
    label: 'Головна',
    description: 'Огляд ваших занять і студентів',
  },
  {
    key: '/instructor/schedule',
    icon: <CalendarOutlined />,
    label: 'Мій розклад',
    description: 'Ваш розклад практичних занять',
  },
  {
    key: '/instructor/practice',
    icon: <CarOutlined />,
    label: 'Практичні заняття',
    description: 'Практичні заняття з водіння',
  },
  {
    key: '/instructor/my-students',
    icon: <TeamOutlined />,
    label: 'Мої студенти',
    description: 'Студенти, яких ви навчаєте',
  },
  {
    key: '/instructor/notifications',
    icon: <BellOutlined />,
    label: 'Сповіщення',
    description: 'Ваші сповіщення та оновлення',
  },
  {
    key: '/instructor/profile',
    icon: <UserOutlined />,
    label: 'Профіль',
    description: 'Особисті дані та безпека акаунта',
  },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const InstructorLayout = () => (
  <BaseLayout roleTitle="Інструктор" menuItems={instructorMenuItems} routePrefix="/instructor" />
);

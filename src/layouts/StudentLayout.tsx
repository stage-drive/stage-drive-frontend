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
import { BaseLayout } from '@/layouts/BaseLayout';
import type { AppNavItem } from '@/layouts/types';

const studentMenuItems: AppNavItem[] = [
  {
    key: '/student/dashboard',
    icon: <HomeOutlined />,
    label: 'Головна',
    description: 'Огляд вашого навчання',
  },
  {
    key: '/student/schedule',
    icon: <CalendarOutlined />,
    label: 'Мій розклад',
    description: 'Ваш розклад занять',
  },
  {
    key: '/student/theory',
    icon: <BookOutlined />,
    label: 'Теоретичний курс',
    description: 'Матеріали теоретичного курсу',
  },
  {
    key: '/student/tests',
    icon: <FileTextOutlined />,
    label: 'Тести',
    description: 'Тести з правил дорожнього руху',
  },
  {
    key: '/student/practice',
    icon: <CarOutlined />,
    label: 'Практичні заняття',
    description: 'Ваші практичні заняття з водіння',
  },
  {
    key: '/student/progress',
    icon: <RiseOutlined />,
    label: 'Мій прогрес',
    description: 'Прогрес навчання та результати',
  },
  {
    key: '/student/payments',
    icon: <DollarOutlined />,
    label: 'Оплати',
    description: 'Статус оплат за навчання',
  },
  {
    key: '/student/notifications',
    icon: <BellOutlined />,
    label: 'Сповіщення',
    description: 'Ваші сповіщення та оновлення',
  },
  {
    key: '/student/profile',
    icon: <UserOutlined />,
    label: 'Профіль',
    description: 'Особисті дані та безпека акаунта',
  },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const StudentLayout = () => (
  <BaseLayout roleTitle="Студент" menuItems={studentMenuItems} routePrefix="/student" />
);

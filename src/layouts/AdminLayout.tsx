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
import { BaseLayout } from '@/layouts/BaseLayout';
import type { AppNavItem } from '@/layouts/types';

const adminMenuItems: AppNavItem[] = [
  {
    key: '/admin/dashboard',
    icon: <HomeOutlined />,
    label: 'Головна',
    description: 'Операційний огляд автошколи',
  },
  {
    key: '/admin/users',
    icon: <UserOutlined />,
    label: 'Користувачі',
    description: 'Учасники та запрошення вашої автошколи',
  },
  {
    key: '/admin/students',
    icon: <TeamOutlined />,
    label: 'Студенти',
    description: 'Учні вашої автошколи',
  },
  {
    key: '/admin/groups',
    icon: <SolutionOutlined />,
    label: 'Навчальні групи',
    description: 'Групи студентів і викладачів',
  },
  {
    key: '/admin/cars',
    icon: <CarOutlined />,
    label: 'Автопарк',
    description: 'Автомобілі школи для практики',
  },
  {
    key: '/admin/schedule',
    icon: <CalendarOutlined />,
    label: 'Розклад',
    description: 'Розклад занять автошколи',
  },
  {
    key: '/admin/theory',
    icon: <BookOutlined />,
    label: 'Теоретичний курс',
    description: 'Матеріали теоретичного курсу',
  },
  {
    key: '/admin/practice',
    icon: <TableOutlined />,
    label: 'Практичні заняття',
    description: 'Практичні заняття з водіння',
  },
  {
    key: '/admin/topics',
    icon: <GroupOutlined />,
    label: 'Теми',
    description: 'Теми навчальної програми',
  },
  {
    key: '/admin/payments',
    icon: <DollarOutlined />,
    label: 'Оплата',
    description: 'Оплати та фінансові операції',
  },
  {
    key: '/admin/notifications',
    icon: <BellOutlined />,
    label: 'Сповіщення',
    description: 'Сповіщення адміністратора',
  },
  {
    key: '/admin/profile',
    icon: <UserOutlined />,
    label: 'Профіль',
    description: 'Особисті дані та безпека акаунта',
  },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const AdminLayout = () => (
  <BaseLayout roleTitle="Адміністратор" menuItems={adminMenuItems} routePrefix="/admin" />
);

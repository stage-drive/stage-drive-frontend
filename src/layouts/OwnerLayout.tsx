import {
  HomeOutlined,
  UserSwitchOutlined,
  BarChartOutlined,
  BellOutlined,
  UserOutlined,
  BankOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { BaseLayout } from '@/layouts/BaseLayout';
import type { AppNavItem } from '@/layouts/types';

const ownerMenuItems: AppNavItem[] = [
  {
    key: '/owner/dashboard',
    icon: <HomeOutlined />,
    label: 'Головна',
    description: 'Огляд ключових показників автошколи',
  },
  {
    key: '/owner/admins',
    icon: <UserSwitchOutlined />,
    label: 'Адміністратори',
    description: 'Управління адміністраторами школи',
  },
  {
    key: '/owner/branches',
    icon: <BarChartOutlined />,
    label: 'Філії / Статистика',
    description: 'Філії та аналітика по школі',
  },
  {
    key: '/owner/notifications',
    icon: <BellOutlined />,
    label: 'Сповіщення',
    description: 'Ваші сповіщення та оновлення',
  },
  {
    key: '/owner/profile',
    icon: <UserOutlined />,
    label: 'Профіль',
    description: 'Особисті дані та безпека акаунта',
  },
  {
    key: '/owner/school-settings',
    icon: <BankOutlined />,
    label: 'Автошкола',
    description: 'Назва і логотип школи',
  },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const OwnerLayout = () => (
  <BaseLayout roleTitle="Панель Власника" menuItems={ownerMenuItems} routePrefix="/owner" />
);

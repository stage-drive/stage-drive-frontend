import {
  HomeOutlined,
  SolutionOutlined,
  TeamOutlined,
  BookOutlined,
  FileTextOutlined,
  CheckSquareOutlined,
  BellOutlined,
  UserOutlined,
  LogoutOutlined,
} from '@ant-design/icons';
import { BaseLayout } from '@/layouts/BaseLayout';
import type { AppNavItem } from '@/layouts/types';

const teacherMenuItems: AppNavItem[] = [
  {
    key: '/teacher/dashboard',
    icon: <HomeOutlined />,
    label: 'Головна',
    description: 'Огляд ваших груп і занять',
  },
  {
    key: '/teacher/my-groups',
    icon: <SolutionOutlined />,
    label: 'Мої групи',
    description: 'Навчальні групи, які ви ведете',
  },
  {
    key: '/teacher/my-students',
    icon: <TeamOutlined />,
    label: 'Мої студенти',
    description: 'Студенти ваших груп',
  },
  {
    key: '/teacher/theory',
    icon: <BookOutlined />,
    label: 'Теоретичний курс',
    description: 'Матеріали теоретичного курсу',
  },
  {
    key: '/teacher/tests',
    icon: <FileTextOutlined />,
    label: 'Тести',
    description: 'Тести та результати студентів',
  },
  {
    key: '/teacher/attendance',
    icon: <CheckSquareOutlined />,
    label: 'Відвідуваність',
    description: 'Облік відвідуваності занять',
  },
  {
    key: '/teacher/notifications',
    icon: <BellOutlined />,
    label: 'Сповіщення',
    description: 'Ваші сповіщення та оновлення',
  },
  {
    key: '/teacher/profile',
    icon: <UserOutlined />,
    label: 'Профіль',
    description: 'Особисті дані та безпека акаунта',
  },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const TeacherLayout = () => (
  <BaseLayout roleTitle="Викладач" menuItems={teacherMenuItems} routePrefix="/teacher" />
);

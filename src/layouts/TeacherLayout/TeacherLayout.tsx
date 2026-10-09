import { BaseLayout } from '../BaseLayout';
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
import type { MenuProps } from 'antd';

const teacherMenuItems: MenuProps['items'] = [
  { key: '/teacher/dashboard', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/teacher/my-groups', icon: <SolutionOutlined />, label: 'Мої групи' },
  { key: '/teacher/my-students', icon: <TeamOutlined />, label: 'Мої студенти' },
  { key: '/teacher/theory', icon: <BookOutlined />, label: 'Теоретичний курс' },
  { key: '/teacher/tests', icon: <FileTextOutlined />, label: 'Тести' },
  { key: '/teacher/attendance', icon: <CheckSquareOutlined />, label: 'Відвідуваність' },
  { key: '/teacher/notifications', icon: <BellOutlined />, label: 'Сповіщення' },

  { type: 'divider' },
  { key: '/teacher/profile', icon: <UserOutlined />, label: 'Профіль' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const TeacherLayout = () => (
  <BaseLayout roleTitle="Викладач" menuItems={teacherMenuItems} profilePath="/teacher/profile" />
);

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
  { key: '/', icon: <HomeOutlined />, label: 'Головна' },
  { key: '/my-groups', icon: <SolutionOutlined />, label: 'Мої групи' },
  { key: '/my-students', icon: <TeamOutlined />, label: 'Мої студенти' },
  { key: '/theory', icon: <BookOutlined />, label: 'Теоретичний курс' },
  { key: '/tests', icon: <FileTextOutlined />, label: 'Тести' },
  { key: '/attendance', icon: <CheckSquareOutlined />, label: 'Відвідуваність' },
  { key: '/notifications', icon: <BellOutlined />, label: 'Сповіщення' },

  { type: 'divider' },
  { key: '/profile', icon: <UserOutlined />, label: 'Профіль' },
  { key: 'logout', icon: <LogoutOutlined />, label: 'Вийти', danger: true },
];

export const TeacherLayout = () => <BaseLayout roleTitle="Викладач" menuItems={teacherMenuItems} />;

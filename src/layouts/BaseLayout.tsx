import React, { useState } from 'react';
import {
  Avatar,
  Badge,
  Flex,
  Image,
  Layout,
  Menu,
  Switch,
  theme,
  Button,
  Space,
  Typography,
  type MenuProps,
} from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  BellOutlined,
  UserOutlined,
  DoubleLeftOutlined,
  DoubleRightOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useThemeMode } from '@/app/ThemeModeProvider';
import { resolveMediaUrl } from '@/shared/utils/resolveMediaUrl';
import { useGetMeQuery } from '@/store/api/endpoints/authApi';
import type { UserRole } from '@/store/api/types';
import { baseApi } from '@/store/api/baseApi';
import logoIcon from '@/assets/icons/logoIcon.svg';
import logoFull from '@/assets/icons/logofull.png';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

const roleLabels: Record<UserRole, string> = {
  OWNER: 'Власник',
  ADMIN: 'Адміністратор',
  TEACHER: 'Викладач',
  INSTRUCTOR: 'Інструктор',
  STUDENT: 'Студент',
};

interface BaseLayoutProps {
  roleTitle: string;
  menuItems: MenuProps['items'];
  routePrefix?: string;
  profilePath?: string;
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({
  roleTitle,
  menuItems,
  routePrefix = '',
  profilePath: profilePathOverride,
}) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { mode, setDarkTheme } = useThemeMode();
  const { data: user } = useGetMeQuery();
  const profileName = user ? `${user.firstName} ${user.lastName}` : '';
  const profileRole = user ? roleLabels[user.role] : roleTitle;
  const navigationItems = menuItems?.filter((item) => !item || !('key' in item) || item.key !== 'logout');
  const logoutItem = menuItems?.find((item) => !!item && 'key' in item && item.key === 'logout');
  const notificationsPath = routePrefix ? `${routePrefix}/notifications` : '/notifications';
  const profilePath = profilePathOverride || (routePrefix ? `${routePrefix}/profile` : '/profile');

  const {
    token: { colorBgContainer, colorBgLayout, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick: MenuProps['onClick'] = ({ key }) => {
    if (key === 'logout') {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
      dispatch(baseApi.util.resetApiState());
      window.dispatchEvent(new Event('auth-change'));
      navigate('/login', { replace: true });
    } else {
      navigate(key);
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
        trigger={null}
        styles={{
          root: { overflow: 'visible', zIndex: 3 },
          body: { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 },
        }}
      >
        <Flex vertical style={{ position: 'relative', flex: 1, minHeight: 0 }}>
          <Button
            type="default"
            shape="circle"
            className="sider-toggle"
            aria-label={collapsed ? 'Розгорнути меню' : 'Згорнути меню'}
            icon={collapsed ? <DoubleRightOutlined /> : <DoubleLeftOutlined />}
            onClick={() => setCollapsed((value) => !value)}
            style={{
              position: 'absolute',
              zIndex: 5,
              top: collapsed ? 54 : 78,
              right: -14,
              width: 28,
              height: 28,
              minWidth: 28,
              background: '#0052FF',
              color: '#fff',
              border: '2px solid #fff',
              boxShadow: '0 2px 8px rgba(3, 16, 43, 0.28)',
            }}
          />
          <Flex
            align="center"
            justify="center"
            style={{
              flex: 'none',
              height: collapsed ? 64 : 72,
              margin: collapsed ? 8 : 16,
              overflow: 'hidden',
              minWidth: 0,
            }}
          >
            <Image
              src={collapsed ? logoIcon : logoFull}
              alt="Logo"
              preview={false}
              styles={{ root: { width: '100%', lineHeight: 0 } }}
              style={{
                width: '100%',
                height: collapsed ? 40 : 48,
                objectFit: 'contain',
              }}
            />
          </Flex>

          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={navigationItems}
            onClick={handleMenuClick}
            style={{ flex: 'none' }}
          />
          {logoutItem ? (
            <Menu
              theme="dark"
              mode="inline"
              selectable={false}
              items={[logoutItem]}
              onClick={handleMenuClick}
              style={{ flex: 'none', marginTop: 'auto', marginBottom: 16 }}
            />
          ) : null}
        </Flex>
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: mode === 'dark' ? '#03102B' : colorBgContainer,
            position: 'relative',
            zIndex: 2,
            boxShadow:
              mode === 'dark'
                ? '0 8px 24px rgba(0, 0, 0, 0.45)'
                : '0 10px 28px rgba(3, 16, 43, 0.14)',
            borderBottom: mode === 'dark' ? '1px solid rgba(255, 255, 255, 0.08)' : undefined,
            clipPath: 'inset(0 0 -40px 0)',
            display: 'flex',
            alignItems: 'center',
            lineHeight: 'normal',
          }}
        >
          <Flex align="center" justify="space-between" style={{ width: '100%' }}>
            <Text strong style={{ fontSize: 16 }}>
              {roleTitle}
            </Text>
            <Space size={16} align="center">
              <Flex align="center" gap={8}>
                <Text>Темна тема</Text>
                <Switch
                  checked={mode === 'dark'}
                  onChange={setDarkTheme}
                  checkedChildren={<MoonOutlined />}
                  unCheckedChildren={<SunOutlined />}
                  aria-label={mode === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
                />
              </Flex>
              <Button
                type="text"
                shape="circle"
                onClick={() => navigate(notificationsPath)}
                aria-label="Сповіщення: 1 непрочитане"
                icon={
                  <Badge count={1} size="small">
                    <BellOutlined style={{ fontSize: 18 }} />
                  </Badge>
                }
              />

              <Button
                type="text"
                className="header-profile"
                onClick={() => navigate(profilePath)}
                aria-label={profileName ? `${profileName}, ${profileRole}` : 'Профіль'}
              >
                <Flex align="center" gap={10}>
                  <Avatar
                    shape="circle"
                    size={40}
                    src={resolveMediaUrl(user?.avatarUrl)}
                    icon={<UserOutlined />}
                  />
                  <Flex vertical justify="center" style={{ maxWidth: 180, lineHeight: 1.2 }}>
                    <Text strong ellipsis style={{ fontSize: 14, lineHeight: '18px' }}>
                      {profileName || 'Профіль'}
                    </Text>
                    <Text type="secondary" ellipsis style={{ fontSize: 12, lineHeight: '16px' }}>
                      {profileRole}
                    </Text>
                  </Flex>
                </Flex>
              </Button>
            </Space>
          </Flex>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgLayout,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

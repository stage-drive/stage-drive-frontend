import React, { useState } from 'react';
import {
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
  MenuUnfoldOutlined,
  MenuFoldOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons';
import { useThemeMode } from '@/app/ThemeModeProvider';
import { baseApi } from '@/store/api/baseApi';
import logoIcon from '@/assets/icons/logoIcon.svg';
import logoFull from '@/assets/icons/logofull.png';

const { Header, Sider, Content } = Layout;
const { Text } = Typography;

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
        trigger={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        styles={{
          root: { overflow: 'hidden', zIndex: 3 },
          body: { display: 'flex', flexDirection: 'column', height: '100%', minHeight: 0 },
        }}
      >
        <Flex vertical style={{ flex: 1, minHeight: 0 }}>
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
            items={menuItems}
            onClick={handleMenuClick}
            style={{ flex: 1, minHeight: 0, overflow: 'auto' }}
          />
          <Flex
            align="center"
            justify={collapsed ? 'center' : 'space-between'}
            style={{
              flex: 'none',
              height: 56,
              paddingInline: collapsed ? 0 : 16,
              borderTop: '1px solid rgba(255, 255, 255, 0.12)',
            }}
          >
            {collapsed ? null : <Text style={{ color: '#fff' }}>Темна тема</Text>}
            <Switch
              checked={mode === 'dark'}
              onChange={setDarkTheme}
              checkedChildren={<MoonOutlined />}
              unCheckedChildren={<SunOutlined />}
              aria-label={mode === 'dark' ? 'Увімкнути світлу тему' : 'Увімкнути темну тему'}
            />
          </Flex>
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
          }}
        >
          <Flex align="center" justify="space-between" style={{ height: '100%' }}>
            <Text strong style={{ fontSize: 16 }}>
              {roleTitle}
            </Text>
            <Space size={16} align="center">
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
                shape="circle"
                icon={<UserOutlined style={{ fontSize: 18 }} />}
                onClick={() => navigate(profilePath)}
              />
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

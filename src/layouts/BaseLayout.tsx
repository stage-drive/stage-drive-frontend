import React, { useState } from 'react';
import { Layout, Menu, theme, Badge, Button, Space, type MenuProps } from 'antd';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  BellOutlined,
  UserOutlined,
  MenuUnfoldOutlined,
  MenuFoldOutlined,
} from '@ant-design/icons';
import { baseApi } from '../store/api/baseApi';
import logoIcon from '../assets/icons/logoIcon.svg';
import logoFull from '../assets/icons/logofull.png';

const { Header, Sider, Content } = Layout;

interface BaseLayoutProps {
  roleTitle: string;
  menuItems: MenuProps['items'];
}

export const BaseLayout: React.FC<BaseLayoutProps> = ({ roleTitle, menuItems }) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const {
    token: { colorBgContainer, borderRadiusLG },
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
      >
        <div
          style={{
            height: 70,
            margin: 16,
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: 8,
            overflow: 'hidden',
          }}
        >
          <img
            src={collapsed ? logoIcon : logoFull}
            alt="Logo"
            style={{
              height: collapsed ? 50 : 60,
              maxWidth: '100%',
              objectFit: 'contain',
            }}
          />
        </div>

        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[location.pathname]}
          items={menuItems}
          onClick={handleMenuClick}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            padding: '0 24px',
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
          }}
        >
          <span style={{ fontWeight: 600, fontSize: 16 }}>{roleTitle}</span>
          <Space size={16} align="center">
            <Badge count={1} size="small" offset={[-6, 8]}>
              <Button
                type="text"
                shape="circle"
                icon={<BellOutlined style={{ fontSize: 18 }} />}
                onClick={() => navigate('/notifications')}
              />
            </Badge>

            <Button
              type="text"
              shape="circle"
              icon={<UserOutlined style={{ fontSize: 18 }} />}
              onClick={() => navigate('/profile')}
            />
          </Space>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

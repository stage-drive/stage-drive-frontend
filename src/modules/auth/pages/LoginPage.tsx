import { Flex } from 'antd';
import { LoginForm } from '@/modules/auth/components/LoginForm';

export const LoginPage = () => (
  <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
    <LoginForm />
  </Flex>
);

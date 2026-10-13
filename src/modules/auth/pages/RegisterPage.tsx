import { Flex } from 'antd';
import { RegisterForm } from '@/modules/auth/components/RegisterForm';

export const RegisterPage = () => (
  <Flex align="center" justify="center" style={{ minHeight: '100vh' }}>
    <RegisterForm />
  </Flex>
);

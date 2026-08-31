import React from 'react';
import { RegisterForm } from '../components/RegisterForm';

export const RegisterPage: React.FC = () => {
  return (
    <div style={{ padding: '20px', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
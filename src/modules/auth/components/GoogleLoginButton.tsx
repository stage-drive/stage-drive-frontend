import React from 'react';
import { Button } from 'antd';

export const GoogleLoginButton: React.FC = () => {
  const handleGoogleLogin = () => {
    const backendUrl = import.meta.env.VITE_API_URL || '/api';
    const cleanUrl = backendUrl.replace(/\/+$/, '');
    window.location.href = `${cleanUrl}/auth/google`;
  };

  return (
    <Button
      icon={
        <svg aria-hidden="true" width="18" height="18" viewBox="0 0 48 48">
          <path
            fill="#4285F4"
            d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 13 4 4 13 4 24s9 20 20 20 20-9 20-20c0-1.3-.1-2.6-.4-3.9Z"
          />
          <path
            fill="#34A853"
            d="M6.3 14.7 13 19.5C14.7 15.1 19 12 24 12c3.1 0 5.8 1.2 8 3l5.7-5.7C34 6.1 29.3 4 24 4 16.3 4 9.7 8.3 6.3 14.7Z"
          />
          <path
            fill="#FBBC05"
            d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2C29.1 35.1 26.7 36 24 36c-5.2 0-9.6-3.3-11.3-7.9l-6.5 5C9.5 39.6 16.2 44 24 44Z"
          />
          <path
            fill="#EA4335"
            d="M43.6 20.1H42V20H24v8h11.3c-.8 2.2-2.2 4.2-4.1 5.6l6.2 5.2C40.9 36.1 44 30.5 44 24c0-1.3-.1-2.6-.4-3.9Z"
          />
        </svg>
      }
      block
      onClick={handleGoogleLogin}
      style={{ height: 40, borderColor: '#dadce0', color: '#3c4043', fontWeight: 500 }}
    >
      Увійти через Google
    </Button>
  );
};

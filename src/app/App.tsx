import { BrowserRouter } from 'react-router-dom';
import { App as AntdApp } from 'antd';
import { ThemeModeProvider } from '@/app/ThemeModeProvider';
import { AppRoutes } from '@/app/router/AppRoutes';
import { AuthErrorListener } from '@/app/AuthErrorListener';

export function App() {
  return (
    <ThemeModeProvider>
      <AntdApp>
        <BrowserRouter>
          <AuthErrorListener />
          <AppRoutes />
        </BrowserRouter>
      </AntdApp>
    </ThemeModeProvider>
  );
}

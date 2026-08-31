import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider, App as AntdApp } from 'antd';
import { antdTheme } from '../styles/antdTheme';
import { AppRoutes } from './router/AppRoutes';
import { AuthErrorListener } from './AuthErrorListener';

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <AntdApp>
        <BrowserRouter>
          <AuthErrorListener />
          <AppRoutes />
        </BrowserRouter>
      </AntdApp>
    </ConfigProvider>
  );
}

export default App;
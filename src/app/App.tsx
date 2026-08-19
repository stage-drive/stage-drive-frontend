import { BrowserRouter } from 'react-router-dom';
import { ConfigProvider } from 'antd';
import { antdTheme } from '../styles/antdTheme';
import { AppRoutes } from './router/AppRoutes';

function App() {
  return (
    <ConfigProvider theme={antdTheme}>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;

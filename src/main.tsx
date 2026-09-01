import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { store } from './store/store';
import App from './app/App';
import './index.css';
import 'antd/dist/reset.css';

(function handleOAuthRedirect() {
  const rawHash = window.location.hash || window.location.search;

  if (rawHash) {
    const params = new URLSearchParams(rawHash.replace(/^#/, '').replace(/^\?/, ''));
    const accessToken = params.get('accessToken') || params.get('token');
    const refreshToken = params.get('refreshToken');
    const error = params.get('error');

    if (accessToken) {
      localStorage.setItem('token', accessToken);
      if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
      }
      window.history.replaceState(null, '', '/');
    }

    if (error) {
      localStorage.removeItem('token');
      localStorage.removeItem('refreshToken');
    }
  }
})();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);

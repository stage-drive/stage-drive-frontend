import React, { useEffect } from 'react';
import { App } from 'antd';
import { useNavigate } from 'react-router-dom';

export const AuthErrorListener: React.FC = () => {
  const { modal } = App.useApp();
  const navigate = useNavigate();

  useEffect(() => {
    const showErrorModal = (customMessage?: string) => {
      modal.error({
        title: 'Доступ обмежено',
        content: customMessage || 'Акаунт не знайдено. Зверніться до адміністратора за інвайтом.',
        okText: 'Зрозуміло',
        onOk: () => {
          navigate('/login', { replace: true });
        },
      });
    };

    //  ПЕРЕВІРКА ПОМИЛКИ GOOGLE OAUTH (з URL)
    const rawHash = window.location.hash || window.location.search;
    if (rawHash) {
      const params = new URLSearchParams(rawHash.replace(/^#/, '').replace(/^\?/, ''));
      const error = params.get('error');

      if (error) {
        showErrorModal();
        window.history.replaceState(null, '', '/login');
      }
    }

    //  ПЕРЕВІРКА ПОМИЛКИ ЗВИЧАЙНОГО ЛОГІНУ (з baseApi.ts)
    const handleAuthErrorEvent = (event: Event) => {
      const customEvent = event as CustomEvent<{ message?: string }>;
      showErrorModal(customEvent.detail?.message);
    };

    window.addEventListener('show-auth-error-modal', handleAuthErrorEvent);

    return () => {
      window.removeEventListener('show-auth-error-modal', handleAuthErrorEvent);
    };
  }, [modal, navigate]);

  return null;
};

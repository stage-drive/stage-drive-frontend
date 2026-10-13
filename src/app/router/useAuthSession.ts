import { useEffect, useState } from 'react';
import { useGetMeQuery } from '@/store/api/endpoints/authApi';

export const useAuthSession = () => {
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('token'));

  useEffect(() => {
    const syncToken = () => {
      setToken(localStorage.getItem('token'));
    };

    window.addEventListener('auth-change', syncToken);
    return () => window.removeEventListener('auth-change', syncToken);
  }, []);

  const {
    data: user,
    isLoading,
    isFetching,
    isError,
  } = useGetMeQuery(undefined, {
    skip: !token,
  });

  if (isError && token) {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    setToken(null);
  }

  const isBootstrapping = Boolean(token && !user && (isLoading || isFetching));

  return {
    token,
    userRole: user?.role,
    isBootstrapping,
  };
};

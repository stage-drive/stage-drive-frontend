import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { BaseQueryFn, FetchArgs, FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { Mutex } from 'async-mutex';

const baseUrl = import.meta.env.VITE_API_URL || '/api';
const mutex = new Mutex();

const rawBaseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    const token = localStorage.getItem('token');
    if (token) {
      headers.set('authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

const baseQueryWithReauth: BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> = async (
  args,
  api,
  extraOptions
) => {
  await mutex.waitForUnlock();

  let result = await rawBaseQuery(args, api, extraOptions);

  const url = typeof args === 'string' ? args : args.url;

  if (result.error && (result.error.status === 401 || result.error.status === 403)) {
    if (url.includes('auth/login') || url.includes('auth/register')) {
      return result;
    }

    if (result.error.status === 403) {
      const errorData = result.error.data as { message?: string } | undefined;
      window.dispatchEvent(
        new CustomEvent('show-auth-error-modal', {
          detail: {
            message:
              errorData?.message || 'Акаунт не знайдено. Зверніться до адміністратора за інвайтом.',
          },
        })
      );
      return result;
    }
  }

  if (result.error && result.error.status === 401) {
    if (!mutex.isLocked()) {
      const release = await mutex.acquire();

      try {
        const refreshToken = localStorage.getItem('refreshToken');

        if (refreshToken) {
          const refreshResult = await rawBaseQuery(
            {
              url: 'auth/refresh',
              method: 'POST',
              body: { refreshToken },
            },
            api,
            extraOptions
          );

          if (refreshResult.data) {
            const data = refreshResult.data as { accessToken: string; refreshToken?: string };

            localStorage.setItem('token', data.accessToken);
            if (data.refreshToken) {
              localStorage.setItem('refreshToken', data.refreshToken);
            }

            result = await rawBaseQuery(args, api, extraOptions);
          } else {
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login';
          }
        } else {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      } finally {
        release();
      }
    } else {
      await mutex.waitForUnlock();
      result = await rawBaseQuery(args, api, extraOptions);
    }
  }

  return result;
};

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Auth', 'User', 'Car', 'Lesson', 'Student', 'Instructor', 'Payment', 'Schedule'],
  endpoints: () => ({}),
});

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// Same origin as the backend: nginx proxies /api in prod, Vite dev server in dev.
// Keeps the image environment-agnostic.
const baseUrl = '/api';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl }),
  endpoints: () => ({}),
});

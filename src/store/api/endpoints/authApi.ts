import { baseApi } from '../baseApi';

export type UserRole = 'OWNER' | 'ADMIN' | 'TEACHER' | 'INSTRUCTOR' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: 'ACTIVE' | 'PENDING' | 'INACTIVE';
  phone?: string;
  avatarUrl?: string;
  organizationId: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
  user: User;
}

export interface LoginRequest {
  email: string;
  password?: string;
}

export interface RegisterRequest {
  organizationName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  password: string;
  passwordConfirmation: string;
  termsAccepted: true;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // POST /api/auth/login
    login: builder.mutation<AuthResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'auth/login',
        method: 'POST',
        body: credentials,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authApi.util.updateQueryData('getMe', undefined, () => data.user));
        } catch {
          /* login failed — keep getMe cache unchanged */
        }
      },
    }),

    // POST /api/auth/register
    register: builder.mutation<AuthResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'auth/register',
        method: 'POST',
        body: userData,
      }),
      async onQueryStarted(_, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          dispatch(authApi.util.updateQueryData('getMe', undefined, () => data.user));
        } catch {
          /* register failed — keep getMe cache unchanged */
        }
      },
    }),

    // POST /api/auth/refresh
    refreshToken: builder.mutation<AuthResponse, { refreshToken?: string } | void>({
      query: (body) => ({
        url: 'auth/refresh',
        method: 'POST',
        body: body || {},
      }),
    }),

    // GET /api/users/me
    getMe: builder.query<User, void>({
      query: () => ({
        url: 'users/me', // або 'auth/me' в залежності від вашого бэкенду
        method: 'GET',
      }),
      providesTags: ['User'],
    }),

    // POST /api/auth/logout
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'auth/logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth', 'User'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMeQuery,
  useLoginMutation,
  useRegisterMutation,
  useLazyGetMeQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;

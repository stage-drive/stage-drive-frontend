import { baseApi } from '../baseApi';

export type UserRole = 'OWNER' | 'ADMIN' | 'TEACHER' | 'INSTRUCTOR' | 'STUDENT';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  status: 'INVITED' | 'ACTIVE' | 'BLOCKED' | 'ARCHIVED';
  phone?: string | null;
  avatarUrl?: string | null;
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
  phone?: string | null;
  password: string;
  passwordConfirmation: string;
  termsAccepted: true;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface ApiMessageResponse {
  message: string;
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

    // POST /api/auth/forgot-password
    forgotPassword: builder.mutation<void, ForgotPasswordRequest>({
      query: (credentials) => ({
        url: 'auth/forgot-password',
        method: 'POST',
        body: credentials,
      }),
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

    updateMe: builder.mutation<User, UpdateProfileRequest>({
      query: (body) => ({
        url: 'users/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    uploadMyAvatar: builder.mutation<User, FormData>({
      query: (body) => ({
        url: 'users/me/avatar',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    deleteMyAvatar: builder.mutation<User, void>({
      query: () => ({
        url: 'users/me/avatar',
        method: 'DELETE',
      }),
      invalidatesTags: ['User'],
    }),

    changeMyPassword: builder.mutation<ApiMessageResponse, ChangePasswordRequest>({
      query: (body) => ({
        url: 'users/me/password',
        method: 'PATCH',
        body,
      }),
    }),

    deleteMe: builder.mutation<void, void>({
      query: () => ({
        url: 'users/me',
        method: 'DELETE',
      }),
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
  useUpdateMeMutation,
  useUploadMyAvatarMutation,
  useDeleteMyAvatarMutation,
  useChangeMyPasswordMutation,
  useDeleteMeMutation,
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useLazyGetMeQuery,
  useRefreshTokenMutation,
  useLogoutMutation,
} = authApi;

import { baseApi } from '../baseApi';

export type UserRole = 'OWNER' | 'ADMIN' | 'TEACHER' | 'INSTRUCTOR' | 'STUDENT';

export interface SendInviteRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role?: UserRole;
}

export type MemberRole = Extract<UserRole, 'TEACHER' | 'INSTRUCTOR' | 'STUDENT'>;

export interface SendMemberInviteRequest extends Omit<SendInviteRequest, 'role'> {
  role: MemberRole;
}

export interface SendInviteResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string | null;
    role: UserRole;
    status: 'INVITED' | 'ACTIVE';
    organizationId: string;
  };
  invitation: {
    id: string;
    email: string;
    role: UserRole;
    status: 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'EXPIRED';
    expiresAt: string;
    userId: string;
    organizationId: string;
  };
}

export interface VerifyTokenResponse {
  valid: boolean;
  email: string;
  role: UserRole;
  schoolName: string;
}

export interface ActivateAccountRequest {
  token: string;
  password: string;
  passwordConfirmation: string;
}

export interface ActivateAccountResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: UserRole;
    status: 'INVITED' | 'ACTIVE';
    organizationId: string;
  };
  invitation: {
    id: string;
    email: string;
    role: UserRole;
    status: 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'EXPIRED';
    acceptedAt?: string;
    userId: string;
    organizationId: string;
  };
}

export interface InvitationItem {
  id: string;
  email: string;
  role: 'OWNER' | 'ADMIN' | 'TEACHER' | 'INSTRUCTOR' | 'STUDENT';
  status: 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'EXPIRED';
  createdAt?: string;
  expiresAt: string;
  emailDelivery?: {
    status: string;
    attempts: number;
    lastError: string | null;
    sentAt: string | null;
    queuedAt: string | null;
  };
}

export interface GetInvitationsResponse {
  invitations: InvitationItem[];
}

export const invitationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    // 1. Отримати список запрошень (GET)
    getInvitations: builder.query<InvitationItem[], void>({
      query: () => ({
        url: 'invitations',
        method: 'GET',
      }),
      transformResponse: (response: GetInvitationsResponse) => response.invitations,
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Invitations' as const, id })),
              { type: 'Invitations', id: 'LIST' },
            ]
          : [{ type: 'Invitations', id: 'LIST' }],
    }),
    // Надіслати запрошення (Auth)
    sendInvitation: builder.mutation<SendInviteResponse, SendInviteRequest>({
      query: (body) => ({
        url: 'invitations',
        method: 'POST',
        body,
      }),
      // Інвалідує весь список -> викликає авто-рефеч getInvitations
      invalidatesTags: ['User', 'Dashboard', { type: 'Invitations', id: 'LIST' }],
    }),

    // Перевірити токен перед активацією (Public)
    verifyInvitationToken: builder.query<VerifyTokenResponse, { token: string }>({
      query: (body) => ({
        url: 'invitations/verify',
        method: 'POST',
        body,
      }),
    }),

    // Активувати акаунт за токеном (Public)
    activateAccount: builder.mutation<ActivateAccountResponse, ActivateAccountRequest>({
      query: (body) => ({
        url: 'invitations/activate',
        method: 'POST',
        body,
      }),
    }),

    // ADMIN запрошує TEACHER, INSTRUCTOR або STUDENT
    sendMemberInvitation: builder.mutation<SendInviteResponse, SendMemberInviteRequest>({
      query: (body) => ({
        url: 'invitations/members',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User', 'Dashboard', { type: 'Invitations', id: 'LIST' }],
    }),

    // Скасувати запрошення (Auth)
    cancelInvitation: builder.mutation<void, string>({
      query: (id) => ({
        url: `invitations/${id}/cancel`,
        method: 'POST',
      }),
      // Інвалідує конкретне запрошення за ID та весь список
      invalidatesTags: (_result, _error, id) => [
        { type: 'Invitations', id },
        { type: 'Invitations', id: 'LIST' },
        'Dashboard',
      ],
    }),

    resendInvitation: builder.mutation<InvitationItem, string>({
      query: (id) => ({
        url: `invitations/${id}/resend`,
        method: 'POST',
      }),
      invalidatesTags: (_result, _error, id) => [
        { type: 'Invitations', id },
        { type: 'Invitations', id: 'LIST' },
        'Dashboard',
      ],
    }),
  }),
});

export const {
  useGetInvitationsQuery,
  useSendInvitationMutation,
  useVerifyInvitationTokenQuery,
  useActivateAccountMutation,
  useSendMemberInvitationMutation,
  useCancelInvitationMutation,
  useResendInvitationMutation,
} = invitationsApi;

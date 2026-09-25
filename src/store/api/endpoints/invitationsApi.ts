import { baseApi } from '../baseApi';

export interface SendInviteRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}
interface SendInviteResponse {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    role: 'ADMIN';
    status: 'INVITED';
    organizationId: string;
  };
  invitation: {
    id: string;
    email: string;
    role: 'ADMIN';
    status: 'PENDING';
    expiresAt: string;
    userId: string;
    organizationId: string;
  };
}

export const invitationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendInvitation: builder.mutation<SendInviteResponse, SendInviteRequest>({
      query: (body) => ({
        url: 'invitations',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useSendInvitationMutation } = invitationsApi;

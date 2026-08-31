import { baseApi } from '../baseApi';
import type { UserRole } from './authApi';

export interface SendInviteRequest {
  email: string;
  role: Exclude<UserRole, 'OWNER'>; 
  firstName?: string;
  lastName?: string;
}

export const invitationsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    sendInvitation: builder.mutation<void, SendInviteRequest>({
      query: (body) => ({
        url: 'invitations/send',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

export const { useSendInvitationMutation } = invitationsApi;
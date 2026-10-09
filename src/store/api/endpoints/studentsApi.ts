import { baseApi } from '../baseApi';

export type StudentTransmission = 'MANUAL' | 'AUTOMATIC';
export type StudentCategory = 'A' | 'B' | 'C' | 'D' | 'BE' | 'CE' | 'DE';

export interface CreateStudentRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  groupId?: string;
  category?: StudentCategory;
  transmission?: StudentTransmission;
}

export interface CreatedStudentUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: 'STUDENT';
  status: 'INVITED' | 'ACTIVE';
  organizationId: string;
}

export interface CreatedStudentProfile {
  id: string;
  userId: string;
  organizationId: string;
  groupId?: string | null;
  instructorId?: string | null;
  carId?: string | null;
  category?: StudentCategory | null;
  transmission?: StudentTransmission | null;
  trainingStatus: 'INVITED' | 'ACTIVE';
}

export interface CreatedStudentInvitation {
  id: string;
  email: string;
  role: 'STUDENT';
  status: 'PENDING' | 'ACCEPTED' | 'CANCELLED' | 'EXPIRED';
  expiresAt: string;
  userId: string;
  organizationId: string;
  emailDelivery?: {
    status: 'QUEUED' | 'SENT' | 'FAILED';
    attempts: number;
    lastError: string | null;
    sentAt: string | null;
    queuedAt: string | null;
  };
}

export interface CreateStudentResponse {
  user: CreatedStudentUser;
  student: CreatedStudentProfile;
  invitation: CreatedStudentInvitation;
}

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    createStudent: builder.mutation<CreateStudentResponse, CreateStudentRequest>({
      query: (body) => ({
        url: 'students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Student', 'Dashboard', 'Invitations', 'User'],
    }),

    getMyStudentProfile: builder.query<CreatedStudentProfile, void>({
      query: () => ({
        url: 'students/me',
        method: 'GET',
      }),
      providesTags: ['Student'],
    }),
  }),
});

export const { useCreateStudentMutation, useGetMyStudentProfileQuery } = studentsApi;

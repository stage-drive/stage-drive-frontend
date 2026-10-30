import { baseApi } from '@/store/api/baseApi';

export type StudentTransmission = 'MANUAL' | 'AUTOMATIC';
export type StudentCategory = 'A' | 'B' | 'C' | 'D';
export type TrainingStatus =
  | 'INVITED'
  | 'ACTIVE'
  | 'PRACTICE'
  | 'GRADUATED'
  | 'DROPPED'
  | 'ARCHIVED';

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

export interface PracticeCar {
  id: string;
  plateNumber: string;
  category: StudentCategory;
  transmission: StudentTransmission;
  status: 'AVAILABLE' | 'MAINTENANCE' | 'INACTIVE';
  instructorId?: string | null;
}

export interface StudentProfile {
  id: string;
  userId: string;
  organizationId: string;
  groupId?: string | null;
  instructorId?: string | null;
  carId?: string | null;
  car?: PracticeCar | null;
  category?: StudentCategory | null;
  transmission?: StudentTransmission | null;
  trainingStatus: TrainingStatus;
  birthDate?: string | null;
  address?: string | null;
  contractNumber?: string | null;
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
  student: StudentProfile;
  invitation: CreatedStudentInvitation;
}

export type StudentAccountStatus = 'INVITED' | 'ACTIVE' | 'BLOCKED' | 'ARCHIVED';
export type StudentSortBy = 'firstName' | 'lastName' | 'email' | 'phone' | 'status' | 'createdAt';

export interface StudentListItem {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string | null;
  avatarUrl?: string | null;
  role: 'STUDENT';
  status: StudentAccountStatus;
  organizationId: string;
  category: StudentCategory | null;
  transmission: StudentTransmission | null;
  createdAt: string;
}

export interface StudentListQuery {
  search?: string;
  status?: StudentAccountStatus;
  sortBy?: StudentSortBy;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface StudentListResponse {
  students: StudentListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface StudentCard extends Omit<StudentListItem, 'category' | 'transmission'> {
  updatedAt: string;
  student: StudentProfile | null;
}

export interface UpdateStudentRequest {
  firstName?: string;
  lastName?: string;
  phone?: string | null;
  category?: StudentCategory | null;
  transmission?: StudentTransmission | null;
  birthDate?: string | null;
  address?: string | null;
  contractNumber?: string | null;
}

export interface AssignStudentGroupRequest {
  groupId: string;
}

export interface GrantPracticeAccessRequest {
  instructorId: string;
  carId: string;
}

export interface UpdateTrainingStatusRequest {
  status: TrainingStatus;
}

export const studentsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<StudentListResponse, StudentListQuery>({
      query: (query) => ({
        url: 'students',
        params: Object.fromEntries(
          Object.entries(query).filter(([, value]) => value !== undefined && value !== ''),
        ),
      }),
      providesTags: ['Student'],
    }),

    getStudent: builder.query<StudentCard, string>({
      query: (id) => `students/${id}`,
      providesTags: (_result, _error, id) => ['Student', { type: 'Student', id }],
    }),

    createStudent: builder.mutation<CreateStudentResponse, CreateStudentRequest>({
      query: (body) => ({
        url: 'students',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Student', 'Dashboard', 'Invitations', 'User'],
    }),

    updateStudent: builder.mutation<StudentCard, { id: string; body: UpdateStudentRequest }>({
      query: ({ id, body }) => ({
        url: `students/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Student', { type: 'Student', id }],
    }),

    assignStudentGroup: builder.mutation<
      StudentCard,
      { id: string; body: AssignStudentGroupRequest }
    >({
      query: ({ id, body }) => ({
        url: `students/${id}/group`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Student', { type: 'Student', id }],
    }),

    grantPracticeAccess: builder.mutation<
      StudentCard,
      { id: string; body: GrantPracticeAccessRequest }
    >({
      query: ({ id, body }) => ({
        url: `students/${id}/practice-access`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Student', { type: 'Student', id }],
    }),

    updateStudentTrainingStatus: builder.mutation<
      StudentCard,
      { id: string; body: UpdateTrainingStatusRequest }
    >({
      query: ({ id, body }) => ({
        url: `students/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => ['Student', { type: 'Student', id }],
    }),

    archiveStudent: builder.mutation<StudentCard, string>({
      query: (id) => ({
        url: `students/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Student', 'Dashboard'],
    }),

    getMyStudentProfile: builder.query<StudentProfile, void>({
      query: () => ({
        url: 'students/me',
        method: 'GET',
      }),
      providesTags: ['Student'],
    }),
  }),
});

export const {
  useCreateStudentMutation,
  useGetMyStudentProfileQuery,
  useGetStudentsQuery,
  useGetStudentQuery,
  useUpdateStudentMutation,
  useAssignStudentGroupMutation,
  useGrantPracticeAccessMutation,
  useUpdateStudentTrainingStatusMutation,
  useArchiveStudentMutation,
} = studentsApi;

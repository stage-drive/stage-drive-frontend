import { baseApi } from '@/store/api/baseApi';
import type { TrainingStatus } from '@/store/api/endpoints/studentsApi';

export type TrainingGroupStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface TrainingGroupListItem {
  id: string;
  name: string;
  status: TrainingGroupStatus;
  startDate: string | null;
  endDate: string | null;
  teacher: {
    id: string;
    firstName: string;
    lastName: string;
  };
  studentsCount: number;
  createdAt: string;
}

export interface TrainingGroupListResponse {
  groups: TrainingGroupListItem[];
}

export interface GroupStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  trainingStatus: TrainingStatus | null;
  enrolledAt: string;
}

export interface GroupStudentsResponse {
  group: TrainingGroupListItem;
  students: GroupStudent[];
}

export const groupsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<TrainingGroupListResponse, void>({
      query: () => 'groups',
    }),
    getGroupStudents: builder.query<GroupStudentsResponse, string>({
      query: (id) => `groups/${id}/students`,
      providesTags: ['Student'],
    }),
  }),
});

export const { useGetGroupsQuery, useGetGroupStudentsQuery } = groupsApi;

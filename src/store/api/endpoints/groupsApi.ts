import { baseApi } from '@/store/api/baseApi';

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

export const groupsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<TrainingGroupListResponse, void>({
      query: () => 'groups',
    }),
  }),
});

export const { useGetGroupsQuery } = groupsApi;

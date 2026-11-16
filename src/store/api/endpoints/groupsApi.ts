import { baseApi } from '@/store/api/baseApi';

export type TrainingGroupStatus = 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';

export interface ITrainingGroupListItem {
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
  groups: ITrainingGroupListItem[];
}

export interface ICreateGroup {
  name: string;
  teacherId: string;
  startDate: string;
  endDate: string;
}

export interface IGroupTeacher {
  id: string;
  firstName: string;
  lastName: string;
}

export interface IGroupCourse {
  id: string;
  name: string;
}

export interface ITrainingGroup {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  teacher: IGroupTeacher;
  course: IGroupCourse;
  studentsCount: number;
  createdAt: string;
}

export const groupsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getGroups: builder.query<TrainingGroupListResponse, void>({
      query: () => 'groups',
      providesTags: ['Groups'],
    }),
    createGroup: builder.mutation<ITrainingGroup, ICreateGroup>({
      query: (data) => ({
        url: `groups`,
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Groups'],
    }),
  }),
});

export const { useGetGroupsQuery,useCreateGroupMutation } = groupsApi;

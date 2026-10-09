import { baseApi } from '../baseApi';

export type DashboardUserStatus = 'INVITED' | 'ACTIVE' | 'BLOCKED' | 'ARCHIVED';

export interface DashboardOrganization {
  id: string;
  name: string;
  logoUrl?: string | null;
  timezone: string;
}

export interface OwnerDashboardOrganization extends DashboardOrganization {
  status: 'ACTIVE' | 'BLOCKED';
}

export interface DashboardUserCounts {
  total: number;
  byRole: {
    OWNER: number;
    ADMIN: number;
    TEACHER: number;
    INSTRUCTOR: number;
    STUDENT: number;
  };
  byStatus: Record<DashboardUserStatus, number>;
}

export interface DashboardInvitationCounts {
  pending: number;
  expired: number;
}

export interface OwnerDashboard {
  organization: OwnerDashboardOrganization;
  users: DashboardUserCounts;
  invitations: DashboardInvitationCounts;
}

export interface AdminDashboard {
  organization: DashboardOrganization;
  users: {
    total: number;
    byRole: Pick<DashboardUserCounts['byRole'], 'TEACHER' | 'INSTRUCTOR' | 'STUDENT'>;
    byStatus: Record<DashboardUserStatus, number>;
  };
  invitations: DashboardInvitationCounts;
}

interface DashboardProfile {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  status: DashboardUserStatus;
}

export interface TeacherDashboard {
  organization: DashboardOrganization;
  teacher: DashboardProfile;
  stats: {
    groupsTotal: number;
    studentsTotal: number;
    upcomingLessonsTotal: number;
  };
  groups: Array<{
    id: string;
    name: string;
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
    studentsCount: number;
  }>;
  upcomingLessons: Array<{
    id: string;
    groupId: string;
    groupName: string;
    topic: string;
    scheduledAt: string;
  }>;
}

export interface StudentDashboard {
  organization: DashboardOrganization;
  student: DashboardProfile;
  stats: {
    groupsTotal: number;
    upcomingLessonsTotal: number;
  };
  groups: Array<{
    id: string;
    name: string;
    status: 'PLANNED' | 'ACTIVE' | 'COMPLETED' | 'ARCHIVED';
    teacherName: string;
  }>;
  upcomingLessons: Array<{
    id: string;
    groupId: string;
    groupName: string;
    topic: string;
    scheduledAt: string;
  }>;
}

export interface InstructorDashboard {
  organization: DashboardOrganization;
  instructor: DashboardProfile;
  stats: {
    studentsTotal: number;
    upcomingLessonsTotal: number;
  };
  upcomingLessons: Array<{
    id: string;
    studentId: string;
    studentName: string;
    scheduledAt: string;
  }>;
}

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOwnerDashboard: builder.query<OwnerDashboard, void>({
      query: () => 'dashboard',
      providesTags: ['Dashboard'],
    }),
    getAdminDashboard: builder.query<AdminDashboard, void>({
      query: () => 'dashboard/admin',
      providesTags: ['Dashboard'],
    }),
    getTeacherDashboard: builder.query<TeacherDashboard, void>({
      query: () => 'dashboard/teacher',
      providesTags: ['Dashboard'],
    }),
    getStudentDashboard: builder.query<StudentDashboard, void>({
      query: () => 'dashboard/student',
      providesTags: ['Dashboard'],
    }),
    getInstructorDashboard: builder.query<InstructorDashboard, void>({
      query: () => 'dashboard/instructor',
      providesTags: ['Dashboard'],
    }),
  }),
});

export const {
  useGetOwnerDashboardQuery,
  useGetAdminDashboardQuery,
  useGetTeacherDashboardQuery,
  useGetStudentDashboardQuery,
  useGetInstructorDashboardQuery,
} = dashboardApi;

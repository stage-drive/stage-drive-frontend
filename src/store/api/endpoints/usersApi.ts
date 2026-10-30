import { baseApi } from '@/store/api/baseApi';
import type { UserRole } from '@/store/api/types';

export type OrganizationMemberStatus = 'INVITED' | 'ACTIVE' | 'BLOCKED' | 'ARCHIVED';

export interface MemberCar {
  id: string;
  plateNumber: string;
  category: 'A' | 'B' | 'C' | 'D';
  transmission: 'MANUAL' | 'AUTOMATIC';
  status: 'AVAILABLE' | 'MAINTENANCE' | 'INACTIVE';
}

export interface OrganizationMember {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string | null;
  role: UserRole;
  status: OrganizationMemberStatus;
  organizationId: string;
  cars: MemberCar[];
  invitation?: {
    id: string;
    status: string;
  } | null;
}

export interface OrganizationMembersQuery {
  search?: string;
  role?: UserRole;
  status?: OrganizationMemberStatus;
  sortBy?: 'firstName' | 'lastName' | 'email' | 'phone' | 'role' | 'status' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrganizationMembersResponse {
  users: OrganizationMember[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const usersApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganizationMembers: builder.query<OrganizationMembersResponse, OrganizationMembersQuery>({
      query: (query) => ({
        url: 'users',
        params: Object.fromEntries(
          Object.entries(query).filter(([, value]) => value !== undefined && value !== ''),
        ),
      }),
      providesTags: ['User'],
    }),
  }),
});

export const { useGetOrganizationMembersQuery } = usersApi;

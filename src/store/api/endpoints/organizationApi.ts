import { baseApi } from '@/store/api/baseApi';

export interface Organization {
  id: string;
  name: string;
  logoUrl?: string | null;
  timezone: string;
}

export const organizationApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getOrganization: builder.query<Organization, void>({
      query: () => 'organization',
      providesTags: ['Organization'],
    }),

    updateOrganization: builder.mutation<Organization, FormData>({
      query: (body) => ({
        url: 'organization',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Organization', 'Dashboard'],
    }),

    deleteOrganization: builder.mutation<void, void>({
      query: () => ({
        url: 'organization',
        method: 'DELETE',
      }),
      invalidatesTags: ['Organization'],
    }),
  }),
});

export const {
  useGetOrganizationQuery,
  useUpdateOrganizationMutation,
  useDeleteOrganizationMutation,
} = organizationApi;

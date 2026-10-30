import { baseApi } from '@/store/api/baseApi';
import type { StudentCategory, StudentTransmission } from '@/store/api/endpoints/studentsApi';

export type CarStatus = 'AVAILABLE' | 'MAINTENANCE' | 'INACTIVE';

export interface CarInstructor {
  id: string;
  firstName: string;
  lastName: string;
}

export interface CarListItem {
  id: string;
  organizationId: string;
  instructorId?: string | null;
  instructor?: CarInstructor | null;
  plateNumber: string;
  category: StudentCategory;
  transmission: StudentTransmission;
  status: CarStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CarsQuery {
  search?: string;
  category?: StudentCategory;
  transmission?: StudentTransmission;
  instructorId?: string;
  status?: CarStatus;
  sortBy?: 'plateNumber' | 'category' | 'transmission' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface CarsResponse {
  cars: CarListItem[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export const carsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getCars: builder.query<CarsResponse, CarsQuery | void>({
      query: (query) => ({
        url: 'cars',
        params: Object.fromEntries(
          Object.entries(query ?? {}).filter(([, value]) => value !== undefined && value !== ''),
        ),
      }),
      providesTags: ['Car'],
    }),
  }),
});

export const { useGetCarsQuery } = carsApi;

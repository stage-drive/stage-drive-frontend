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

export type CarSortBy = 'plateNumber' | 'category' | 'transmission' | 'createdAt';

export interface CarsQuery {
  search?: string;
  category?: StudentCategory;
  transmission?: StudentTransmission;
  instructorId?: string;
  status?: CarStatus;
  sortBy?: CarSortBy;
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

export interface CreateCarRequest {
  plateNumber: string;
  category: StudentCategory;
  transmission: StudentTransmission;
  instructorId: string;
}

export interface UpdateCarRequest {
  plateNumber?: string;
  category?: StudentCategory;
  transmission?: StudentTransmission;
  instructorId?: string;
}

export interface UpdateCarStatusRequest {
  status: CarStatus;
}

export interface AssignCarInstructorRequest {
  instructorId: string | null;
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

    createCar: builder.mutation<CarListItem, CreateCarRequest>({
      query: (body) => ({
        url: 'cars',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Car'],
    }),

    updateCar: builder.mutation<CarListItem, { id: string; body: UpdateCarRequest }>({
      query: ({ id, body }) => ({
        url: `cars/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Car'],
    }),

    updateCarStatus: builder.mutation<CarListItem, { id: string; body: UpdateCarStatusRequest }>({
      query: ({ id, body }) => ({
        url: `cars/${id}/status`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Car'],
    }),

    assignCarInstructor: builder.mutation<
      CarListItem,
      { id: string; body: AssignCarInstructorRequest }
    >({
      query: ({ id, body }) => ({
        url: `cars/${id}/instructor`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Car'],
    }),
  }),
});

export const {
  useGetCarsQuery,
  useCreateCarMutation,
  useUpdateCarMutation,
  useUpdateCarStatusMutation,
  useAssignCarInstructorMutation,
} = carsApi;

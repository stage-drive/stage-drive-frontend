import type { CarListItem, CarSortBy, CarStatus } from '@/store/api/endpoints/carsApi';

const sortFields: CarSortBy[] = ['plateNumber', 'category', 'transmission', 'createdAt'];

export const isCarSortField = (value: string): value is CarSortBy =>
  sortFields.includes(value as CarSortBy);

const statusTransitions: Record<CarStatus, CarStatus[]> = {
  AVAILABLE: ['MAINTENANCE', 'INACTIVE'],
  MAINTENANCE: ['AVAILABLE', 'INACTIVE'],
  INACTIVE: ['AVAILABLE'],
};

export const nextCarStatuses = (status: CarStatus) => statusTransitions[status];

export const canChangeInstructor = (car: CarListItem) => {
  if (car.status !== 'AVAILABLE') {
    return {
      enabled: false,
      reason: 'Інструктора можна змінити лише коли автомобіль доступний',
    };
  }
  return { enabled: true, reason: undefined };
};

export const normalizePlateNumber = (value: string) => value.replace(/[\s-]/g, '').toUpperCase();

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const data = (error as { data?: { message?: string | string[] } }).data;
  if (Array.isArray(data?.message)) return data.message.join(', ');
  return data?.message || fallback;
};

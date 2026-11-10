import type { CarStatus } from '@/store/api/endpoints/carsApi';
import type { StudentCategory } from '@/store/api/endpoints/studentsApi';

export const CAR_CATEGORIES: StudentCategory[] = ['A', 'B', 'C', 'D'];

export const CAR_STATUS_LABELS: Record<CarStatus, string> = {
  AVAILABLE: 'Доступний',
  MAINTENANCE: 'Обслуговування',
  INACTIVE: 'Не використовується',
};

export const CAR_STATUS_COLORS: Record<CarStatus, string> = {
  AVAILABLE: 'green',
  MAINTENANCE: 'orange',
  INACTIVE: 'default',
};

import type {
  StudentAccountStatus,
  StudentCategory,
  StudentTransmission,
  TrainingStatus,
} from '@/store/api/endpoints/studentsApi';

export const STUDENT_CATEGORIES: StudentCategory[] = ['A', 'B', 'C', 'D'];

export const TRANSMISSION_LABELS: Record<StudentTransmission, string> = {
  MANUAL: 'Механіка',
  AUTOMATIC: 'Автомат',
};

export const ACCOUNT_STATUS_LABELS: Record<StudentAccountStatus, string> = {
  INVITED: 'Запрошений',
  ACTIVE: 'Активний',
  BLOCKED: 'Заблокований',
  ARCHIVED: 'Архів',
};

export const TRAINING_STATUS_LABELS: Record<TrainingStatus, string> = {
  INVITED: 'Запрошений',
  ACTIVE: 'Навчається',
  PRACTICE: 'Практика',
  GRADUATED: 'Випущений',
  DROPPED: 'Відрахований',
  ARCHIVED: 'Архів',
};

export const ACCOUNT_STATUS_COLORS: Record<StudentAccountStatus, string> = {
  INVITED: 'blue',
  ACTIVE: 'green',
  BLOCKED: 'orange',
  ARCHIVED: 'default',
};

export const TRAINING_STATUS_COLORS: Record<TrainingStatus, string> = {
  INVITED: 'blue',
  ACTIVE: 'processing',
  PRACTICE: 'cyan',
  GRADUATED: 'success',
  DROPPED: 'warning',
  ARCHIVED: 'default',
};

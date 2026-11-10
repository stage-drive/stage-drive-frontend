import type {
  StudentAccountStatus,
  StudentCategory,
  StudentTransmission,
  TrainingStatus,
} from '@/store/api/endpoints/studentsApi';

export const STUDENT_CATEGORIES: StudentCategory[] = [
  'A1',
  'A',
  'B1',
  'B',
  'BE',
  'C1',
  'C1E',
  'C',
  'CE',
  'D1',
  'D1E',
  'D',
  'DE',
  'T',
];

export const CATEGORY_LABELS: Record<StudentCategory, string> = {
  A1: 'A1 — мопеди та моторолери до 50 см³',
  A: 'A — мотоцикли',
  B1: 'B1 — квадроцикли і трицикли',
  B: 'B — легкові до 3,5 т',
  BE: 'BE — легкові з причепом',
  C1: 'C1 — вантажні 3,5–7,5 т',
  C1E: 'C1E — вантажні 3,5–7,5 т з причепом',
  C: 'C — вантажні понад 7,5 т',
  CE: 'CE — вантажні з причепом',
  D1: 'D1 — автобуси до 16 місць',
  D1E: 'D1E — автобуси до 16 місць з причепом',
  D: 'D — автобуси понад 16 місць',
  DE: 'DE — автобуси з причепом',
  T: 'T — трамваї і тролейбуси',
};

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

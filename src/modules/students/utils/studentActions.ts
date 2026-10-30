import type { StudentCard, TrainingStatus } from '@/store/api/endpoints/studentsApi';

const blockedGroupStatuses: TrainingStatus[] = ['ARCHIVED', 'DROPPED', 'GRADUATED'];

export const canAssignGroup = (card: StudentCard) => {
  const trainingStatus = card.student?.trainingStatus;
  if (!trainingStatus) {
    return { enabled: false, reason: 'Профіль студента ще не створено' };
  }
  if (blockedGroupStatuses.includes(trainingStatus)) {
    return { enabled: false, reason: 'Студента з цим статусом навчання не можна додати до групи' };
  }
  if (card.student?.groupId) {
    return { enabled: false, reason: 'Студент уже призначений до навчальної групи' };
  }
  if (card.status !== 'INVITED' && card.status !== 'ACTIVE') {
    return { enabled: false, reason: 'Призначити групу можна лише для запрошеного або активного акаунта' };
  }
  return { enabled: true };
};

export const canGrantPracticeAccess = (card: StudentCard) => {
  const profile = card.student;
  if (!profile) {
    return { enabled: false, reason: 'Профіль студента ще не створено' };
  }
  if (card.status !== 'ACTIVE') {
    return { enabled: false, reason: 'Доступ до практики доступний лише для активного акаунта' };
  }
  if (profile.trainingStatus !== 'ACTIVE' && profile.trainingStatus !== 'PRACTICE') {
    return {
      enabled: false,
      reason: 'Допуск до практики доступний для статусів навчання «Навчається» або «Практика»',
    };
  }
  if (!profile.category || !profile.transmission) {
    return { enabled: false, reason: 'Спочатку вкажіть категорію та коробку передач' };
  }
  return { enabled: true };
};

export const canArchiveStudent = (card: StudentCard) => {
  if (card.status === 'ARCHIVED' || card.student?.trainingStatus === 'ARCHIVED') {
    return { enabled: false, reason: 'Студента вже архівовано' };
  }
  return { enabled: true };
};

export const getApiErrorMessage = (error: unknown, fallback: string) => {
  const apiMessage = (error as { data?: { message?: string | string[] } }).data?.message;
  return Array.isArray(apiMessage) ? apiMessage.join(', ') : apiMessage || fallback;
};

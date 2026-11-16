import type { LessonConflict, LessonConflictResource } from '@/store/api/endpoints/lessonsApi';

const resourceLabels: Record<LessonConflictResource, string> = {
  TEACHER: 'Викладач',
  INSTRUCTOR: 'Інструктор',
  GROUP: 'Група',
  CAR: 'Автомобіль',
  STUDENT: 'Студент',
};

export interface LessonActionError {
  title: string;
  conflicts: LessonConflict[];
}

export const readLessonActionError = (error: unknown, fallback: string): LessonActionError => {
  const data = (
    error as {
      data?: {
        message?: string | string[];
        conflicts?: LessonConflict[];
      };
    }
  ).data;
  const conflicts = Array.isArray(data?.conflicts) ? data.conflicts : [];
  if (conflicts.length > 0) {
    return {
      title: 'Неможливо зберегти заняття. Є конфлікт у розкладі.',
      conflicts,
    };
  }
  const message = Array.isArray(data?.message) ? data.message.join(', ') : data?.message;
  return { title: message || fallback, conflicts: [] };
};

export const conflictResourceLabel = (resource: LessonConflictResource) => resourceLabels[resource];

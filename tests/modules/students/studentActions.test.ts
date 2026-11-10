import { describe, expect, it } from 'vitest';
import { trainingStatusOptions } from '@/modules/students/utils/studentActions';
import type { StudentCard, TrainingStatus } from '@/store/api/endpoints/studentsApi';

const cardWithStatus = (trainingStatus: TrainingStatus): StudentCard => ({
  id: 'student-1',
  email: 'student@example.com',
  firstName: 'Олена',
  lastName: 'Коваль',
  role: 'STUDENT',
  status: 'ACTIVE',
  organizationId: 'org-1',
  createdAt: '2026-01-01T00:00:00.000Z',
  updatedAt: '2026-01-01T00:00:00.000Z',
  student: {
    id: 'profile-1',
    userId: 'student-1',
    organizationId: 'org-1',
    trainingStatus,
    category: 'B',
    transmission: 'MANUAL',
  },
});

describe('trainingStatusOptions', () => {
  it('allows invited students to start or drop training', () => {
    expect(trainingStatusOptions(cardWithStatus('INVITED'))).toEqual(['ACTIVE', 'DROPPED']);
  });

  it('allows active and practice students to graduate or drop', () => {
    expect(trainingStatusOptions(cardWithStatus('ACTIVE'))).toEqual(['GRADUATED', 'DROPPED']);
    expect(trainingStatusOptions(cardWithStatus('PRACTICE'))).toEqual(['GRADUATED', 'DROPPED']);
  });

  it('does not offer a manual transition from graduated, dropped, or archived', () => {
    expect(trainingStatusOptions(cardWithStatus('GRADUATED'))).toEqual([]);
    expect(trainingStatusOptions(cardWithStatus('DROPPED'))).toEqual([]);
    expect(trainingStatusOptions(cardWithStatus('ARCHIVED'))).toEqual([]);
  });
});

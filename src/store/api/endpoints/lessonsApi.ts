import { baseApi } from '@/store/api/baseApi';

export type LessonStatus = 'SCHEDULED' | 'COMPLETED' | 'CANCELLED';
export type LessonConflictResource = 'TEACHER' | 'INSTRUCTOR' | 'GROUP' | 'CAR' | 'STUDENT';

export interface LessonPerson {
  id: string;
  firstName: string;
  lastName: string;
}

export interface LessonConflict {
  resource: LessonConflictResource;
  resourceId: string;
  lessonType: 'THEORY' | 'PRACTICE';
  lessonId: string;
  scheduledAt: string;
  endsAt: string;
}

export interface UpdateTheoryLessonRequest {
  topic?: string;
  durationMin?: number;
}

export interface RescheduleLessonRequest {
  scheduledAt: string;
  durationMin?: number;
}

export interface UpdatePracticeLessonRequest {
  durationMin?: number;
  instructorId?: string;
  carId?: string;
}

export interface TheoryLesson {
  id: string;
  type: 'THEORY';
  status: LessonStatus;
  topic: string;
  scheduledAt: string;
  endsAt: string;
  durationMin: number;
  group: { id: string; name: string };
  teacher: LessonPerson;
  updatedAt: string;
}

export interface PracticeLesson {
  id: string;
  type: 'PRACTICE';
  status: LessonStatus;
  scheduledAt: string;
  endsAt: string;
  durationMin: number;
  instructor: LessonPerson;
  student: LessonPerson;
  car: {
    id: string;
    plateNumber: string;
    category: string;
    transmission: 'MANUAL' | 'AUTOMATIC';
  } | null;
  updatedAt: string;
}

export const lessonsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    updateTheoryLesson: builder.mutation<TheoryLesson, { id: string; body: UpdateTheoryLessonRequest }>({
      query: ({ id, body }) => ({
        url: `lessons/theory/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Dashboard', 'Lesson'],
    }),
    rescheduleTheoryLesson: builder.mutation<
      TheoryLesson,
      { id: string; body: RescheduleLessonRequest }
    >({
      query: ({ id, body }) => ({
        url: `lessons/theory/${id}/reschedule`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Dashboard', 'Lesson'],
    }),
    updatePracticeLesson: builder.mutation<
      PracticeLesson,
      { id: string; body: UpdatePracticeLessonRequest }
    >({
      query: ({ id, body }) => ({
        url: `lessons/practice/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Dashboard', 'Lesson'],
    }),
    reschedulePracticeLesson: builder.mutation<
      PracticeLesson,
      { id: string; body: RescheduleLessonRequest }
    >({
      query: ({ id, body }) => ({
        url: `lessons/practice/${id}/reschedule`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['Dashboard', 'Lesson'],
    }),
  }),
});

export const {
  useUpdateTheoryLessonMutation,
  useRescheduleTheoryLessonMutation,
  useUpdatePracticeLessonMutation,
  useReschedulePracticeLessonMutation,
} = lessonsApi;

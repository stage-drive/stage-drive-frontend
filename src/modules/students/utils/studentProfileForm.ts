import dayjs, { type Dayjs } from 'dayjs';
import type { StudentFormValues } from '@/modules/students/components/StudentFormModal';
import { STUDENT_CATEGORIES } from '@/modules/students/constants';
import type { StudentCard, UpdateStudentRequest } from '@/store/api/endpoints/studentsApi';
import { normalizeUkrainianPhone } from '@/shared/utils/ukrainianPhone';

export const toBirthDateValue = (value?: string | null): Dayjs | undefined => {
  if (!value) return undefined;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed : undefined;
};

export const profileDetailsFromCard = (card: StudentCard): Partial<StudentFormValues> => ({
  birthDate: toBirthDateValue(card.student?.birthDate),
  address: card.student?.address ?? undefined,
  contractNumber: card.student?.contractNumber ?? undefined,
});

export const buildUpdateStudentBody = (values: StudentFormValues): UpdateStudentRequest => {
  const category = STUDENT_CATEGORIES.find((item) => item === values.category) ?? null;

  return {
    firstName: values.firstName.trim(),
    lastName: values.lastName.trim(),
    phone: values.phone ? normalizeUkrainianPhone(values.phone) : null,
    category,
    transmission: values.transmission ?? null,
    birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
    address: values.address?.trim() ? values.address.trim() : null,
    contractNumber: values.contractNumber?.trim() ? values.contractNumber.trim() : null,
  };
};

export const formatProfileDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = dayjs(value);
  return parsed.isValid() ? parsed.format('DD.MM.YYYY') : value;
};

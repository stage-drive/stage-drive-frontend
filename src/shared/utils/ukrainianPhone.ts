const UKRAINE_COUNTRY_CODE = '380';

export function normalizeUkrainianPhone(value?: string | null): string | null {
  const digits = value?.replace(/\D/g, '') ?? '';
  if (!digits) return null;

  if (digits.startsWith(UKRAINE_COUNTRY_CODE) && digits.length === 12) {
    return `+${digits}`;
  }

  if (digits.startsWith('0') && digits.length === 10) {
    return `+38${digits}`;
  }

  if (digits.length === 9) {
    return `+${UKRAINE_COUNTRY_CODE}${digits}`;
  }

  return null;
}

export function formatUkrainianPhone(value?: string | null): string {
  const normalized = normalizeUkrainianPhone(value);
  if (!normalized) return value ?? '';

  const subscriberNumber = normalized.slice(4);
  return `+380 (${subscriberNumber.slice(0, 2)}) ${subscriberNumber.slice(2, 5)}-${subscriberNumber.slice(5, 7)}-${subscriberNumber.slice(7, 9)}`;
}

export async function validateUkrainianPhone(_rule: unknown, value: unknown): Promise<void> {
  if (value === undefined || value === null || value === '') return;
  if (typeof value === 'string' && normalizeUkrainianPhone(value)) return;

  throw new Error('Введіть український номер, наприклад +380 (50) 123-45-67');
}

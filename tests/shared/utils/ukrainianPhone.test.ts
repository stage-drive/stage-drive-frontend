import { describe, expect, it } from 'vitest';
import {
  formatUkrainianPhone,
  normalizeUkrainianPhone,
  validateUkrainianPhone,
} from '@/shared/utils/ukrainianPhone';

describe('Ukrainian phone utilities', () => {
  it.each([
    ['0501234567', '+380501234567'],
    ['380501234567', '+380501234567'],
    ['+380 (50) 123-45-67', '+380501234567'],
    ['501234567', '+380501234567'],
  ])('normalizes %s to E.164', (input, expected) => {
    expect(normalizeUkrainianPhone(input)).toBe(expected);
  });

  it('formats a valid number for display', () => {
    expect(formatUkrainianPhone('+380501234567')).toBe('+380 (50) 123-45-67');
  });

  it('returns null for empty and invalid input', () => {
    expect(normalizeUkrainianPhone('')).toBeNull();
    expect(normalizeUkrainianPhone('123')).toBeNull();
  });

  it('allows an empty optional phone and rejects invalid values', async () => {
    await expect(validateUkrainianPhone({}, '')).resolves.toBeUndefined();
    await expect(validateUkrainianPhone({}, '05012')).rejects.toThrow('Введіть український номер');
  });
});

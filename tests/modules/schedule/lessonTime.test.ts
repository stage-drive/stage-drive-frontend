import { describe, expect, it } from 'vitest';
import { toSchoolDateTimeIso, wallClockInTimeZone } from '@/modules/schedule/utils/lessonTime';

describe('school lesson time', () => {
  it('stores 10:00 in Kyiv as 08:00 UTC in November', () => {
    expect(toSchoolDateTimeIso('2026-11-03', '10:00', 'Europe/Kyiv')).toBe(
      '2026-11-03T08:00:00.000Z',
    );
  });

  it('reads the same wall clock back in the school timezone', () => {
    expect(wallClockInTimeZone('2026-11-03T08:00:00.000Z', 'Europe/Kyiv')).toEqual({
      date: '2026-11-03',
      time: '10:00',
    });
  });
});

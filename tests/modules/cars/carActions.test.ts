import { describe, expect, it } from 'vitest';
import { nextCarStatuses, normalizePlateNumber } from '@/modules/cars/utils/carActions';

describe('nextCarStatuses', () => {
  it('allows an available car to go to maintenance or inactive', () => {
    expect(nextCarStatuses('AVAILABLE')).toEqual(['MAINTENANCE', 'INACTIVE']);
  });

  it('allows maintenance to return to available or become inactive', () => {
    expect(nextCarStatuses('MAINTENANCE')).toEqual(['AVAILABLE', 'INACTIVE']);
  });

  it('allows an inactive car to become available only', () => {
    expect(nextCarStatuses('INACTIVE')).toEqual(['AVAILABLE']);
  });
});

describe('normalizePlateNumber', () => {
  it('removes spaces and dashes and uppercases letters', () => {
    expect(normalizePlateNumber(' aa-0001 bb ')).toBe('AA0001BB');
  });
});

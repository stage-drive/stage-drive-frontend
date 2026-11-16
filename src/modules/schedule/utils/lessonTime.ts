const readPart = (parts: Intl.DateTimeFormatPart[], type: Intl.DateTimeFormatPartTypes) =>
  parts.find((part) => part.type === type)?.value ?? '';

export const wallClockInTimeZone = (iso: string, timeZone: string) => {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).formatToParts(new Date(iso));
  const hour = readPart(parts, 'hour') === '24' ? '00' : readPart(parts, 'hour');

  return {
    date: `${readPart(parts, 'year')}-${readPart(parts, 'month')}-${readPart(parts, 'day')}`,
    time: `${hour}:${readPart(parts, 'minute')}`,
  };
};

const offsetMinutes = (timeZone: string, date: Date) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  }).formatToParts(date);
  const hour = readPart(parts, 'hour') === '24' ? '00' : readPart(parts, 'hour');
  const asUtc = Date.UTC(
    Number(readPart(parts, 'year')),
    Number(readPart(parts, 'month')) - 1,
    Number(readPart(parts, 'day')),
    Number(hour),
    Number(readPart(parts, 'minute')),
    Number(readPart(parts, 'second')),
  );
  return Math.round((asUtc - date.getTime()) / 60000);
};

export const toSchoolDateTimeIso = (date: string, time: string, timeZone: string) => {
  const [year, month, day] = date.split('-').map(Number);
  const [hour, minute] = time.split(':').map(Number);
  const wallClockAsUtc = Date.UTC(year, month - 1, day, hour, minute, 0);
  const firstOffset = offsetMinutes(timeZone, new Date(wallClockAsUtc));
  const firstInstant = wallClockAsUtc - firstOffset * 60_000;
  const secondOffset = offsetMinutes(timeZone, new Date(firstInstant));
  return new Date(wallClockAsUtc - secondOffset * 60_000).toISOString();
};

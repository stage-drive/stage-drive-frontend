export const formatLessonTime = (value: string, timezone: string) =>
  new Date(value).toLocaleString('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
    timeZone: timezone,
  });

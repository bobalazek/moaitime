import { endOfDay, startOfDay } from 'date-fns';
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// Time
export const getGmtOffset = (timezone: string) => {
  const now = new Date();
  const zonedDate = utcToZonedTime(now, timezone);
  const offset = format(zonedDate, 'xxx', { timeZone: timezone });

  return `GMT${offset}`;
};

export const isValidTime = (time: string) => {
  const [hours, minutes] = time.split(':');
  if (!hours || !minutes) {
    return false;
  }

  if (hours.length > 2 || minutes.length > 2) {
    return false;
  }

  const hoursNumber = Number(hours);
  const minutesNumber = Number(minutes);

  if (isNaN(hoursNumber) || isNaN(minutesNumber)) {
    return false;
  }

  if (hoursNumber < 0 || hoursNumber > 23) {
    return false;
  }

  if (minutesNumber < 0 || minutesNumber > 59) {
    return false;
  }

  return true;
};

export const getTimezones = () => {
  // Could maybe use the following library instead?
  // https://github.com/vvo/tzdb
  const timezones = new Set<string>();

  timezones.add('UTC');

  for (const timezone of Intl.supportedValuesOf('timeZone')) {
    timezones.add(timezone);
  }

  return Array.from(timezones).sort();
};

// Errors
export const zodErrorToString = (error: unknown) => {
  if (Array.isArray((error as { errors: unknown[] }).errors)) {
    return (error as { errors: unknown[] }).errors
      .map((err) => {
        if (typeof err === 'string') {
          return err;
        }

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        return (err as any).message ?? 'Something went wrong';
      })
      .join('; ');
  }

  if (Array.isArray(error)) {
    return error.map((err) => err.message).join(', ');
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};

export const convertObjectNullPropertiesToUndefined = <T extends Record<string, unknown>>(
  obj: T
) => {
  const newObj: Partial<T> = { ...obj };

  for (const key of Object.keys(newObj)) {
    if (newObj[key] === null) {
      delete newObj[key];
    }
  }

  return newObj;
};

export const getTimezonedStartOfDay = (timezone: string, date?: string): Date | null => {
  if (!date) {
    return null;
  }

  const zonedToDate = utcToZonedTime(date, timezone);
  return zonedTimeToUtc(startOfDay(zonedToDate), timezone);
};

export const getTimezonedEndOfDay = (timezone: string, date: string): Date | null => {
  if (!date) {
    return null;
  }

  const zonedToDate = utcToZonedTime(date, timezone);
  return zonedTimeToUtc(endOfDay(zonedToDate), timezone);
};

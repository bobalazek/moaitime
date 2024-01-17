import { endOfDay, startOfDay } from 'date-fns';
import { format, utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

// General
export const sleep = (milliseconds: number): Promise<unknown> => {
  return new Promise((resolve) => {
    return setTimeout(resolve, milliseconds);
  });
};

// Time
export const getGmtOffset = (timezone: string) => {
  const now = new Date();
  const zonedDate = utcToZonedTime(now, timezone);
  const offset = format(zonedDate, 'xxx', { timeZone: timezone });

  return `GMT${offset}`;
};

export const isValidDate = (date: string) => {
  const dateObject = new Date(date);
  return !isNaN(dateObject.getTime());
};

export const isValidTime = (time: string) => {
  if (!time) {
    return false;
  }

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

// UUID
// Could have used the UUID library, but one of our other dependencies requires a lower version,
// which we are then unable to use
export const isValidUuid = (str: string): boolean => {
  const pattern = /^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i;
  return pattern.test(str);
};

// Queues
export const getQueueTypes = () => {
  // BullMQ queue types
  return [
    'waiting',
    'wait',
    'delayed',
    'active',
    'completed',
    'failed',
    'repeat',
    'waiting-children',
  ];
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

// Time
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

export const durationToHoursMinutesSeconds = (durationSeconds: number) => {
  const hours = durationSeconds ? Math.floor(durationSeconds / 3600) : 0;
  const minutes = durationSeconds ? Math.floor((durationSeconds - hours * 3600) / 60) : 0;
  const seconds = durationSeconds ? durationSeconds - hours * 3600 - minutes * 60 : 0;

  return { hours, minutes, seconds };
};

export const getDurationText = (durationSeconds: number) => {
  const { hours, minutes, seconds } = durationToHoursMinutesSeconds(durationSeconds);

  return `${hours ? `${hours}h ` : ''}${minutes ? `${minutes}m ` : ''}${
    seconds ? `${seconds}s` : ''
  }`;
};

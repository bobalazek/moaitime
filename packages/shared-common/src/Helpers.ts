import { utcToZonedTime } from 'date-fns-tz';

// Time
export const getGmtOffset = (timezone: string) => {
  const date = new Date();
  const zonedDate = utcToZonedTime(date, timezone);
  const offset = -zonedDate.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const prefix = offset >= 0 ? '+' : '-';

  return `GMT${prefix}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes
    .toString()
    .padStart(2, '0')}`;
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
  timezones.add('GMT');

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

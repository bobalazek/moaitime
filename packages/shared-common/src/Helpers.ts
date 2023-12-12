import { utcToZonedTime } from 'date-fns-tz';

export function getGmtOffset(timezone: string) {
  const date = new Date();
  const zonedDate = utcToZonedTime(date, timezone);
  const offset = -zonedDate.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const prefix = offset >= 0 ? '+' : '-';

  return `GMT${prefix}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes
    .toString()
    .padStart(2, '0')}`;
}

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
    return error.map((e) => e.message).join(', ');
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
};

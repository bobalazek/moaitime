import { utcToZonedTime } from 'date-fns-tz';

export function getGmtOffset(timezone: string) {
  const date = new Date();
  const zonedDate = utcToZonedTime(date, timezone);
  const offset = -zonedDate.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60);
  const offsetMinutes = Math.abs(offset) % 60;
  const prefix = offset >= 0 ? '+' : '-';

  return `GMT${prefix}${offsetHours.toString().padStart(2, '0')}:${offsetMinutes.toString().padStart(2, '0')}`;
}

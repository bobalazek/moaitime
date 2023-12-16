import { endOfDay, startOfDay } from 'date-fns';
import { utcToZonedTime, zonedTimeToUtc } from 'date-fns-tz';

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

import { utcToZonedTime } from 'date-fns-tz';
import { memo } from 'react';

import { CalendarEntry as CalendarEntryType } from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../auth/state/authStore';

export type CalendarEntryTimesProps = {
  calendarEntry: CalendarEntryType;
  includeDate?: boolean;
};

export const CalendarEntryTimes = memo(
  ({ calendarEntry, includeDate }: CalendarEntryTimesProps) => {
    const generalTimezone = useAuthUserSetting('generalTimezone', 'UTC');
    const clockUse24HourClock = useAuthUserSetting('clockUse24HourClock', false);

    const localStartTime = utcToZonedTime(calendarEntry.startsAtUtc, generalTimezone);
    const localEndTime = utcToZonedTime(calendarEntry.endsAtUtc, generalTimezone);

    const startTime = localStartTime.toLocaleString('default', {
      minute: '2-digit',
      hour: '2-digit',
      hour12: !clockUse24HourClock,
    });

    const endTime = localEndTime.toLocaleString('default', {
      minute: '2-digit',
      hour: '2-digit',
      hour12: !clockUse24HourClock,
    });

    const startDate = includeDate
      ? localStartTime.toLocaleString('default', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : undefined;
    const endDate = includeDate
      ? localEndTime.toLocaleString('default', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        })
      : undefined;

    const isSameDay = startDate === endDate;

    if (includeDate && isSameDay) {
      return (
        <>
          {startDate} {startTime} - {endTime}
        </>
      );
    } else if (includeDate && !isSameDay) {
      return (
        <>
          {startDate} {startTime} - {endDate} {endTime}
        </>
      );
    }

    return (
      <>
        {startTime} - {endTime}
      </>
    );
  }
);

export default CalendarEntryTimes;

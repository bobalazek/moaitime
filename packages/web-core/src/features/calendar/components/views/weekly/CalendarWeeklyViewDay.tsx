import { useEffect, useMemo, useRef, useState } from 'react';

import {
  CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX,
  CalendarEntryWithVerticalPosition,
} from '@moaitime/shared-common';

import { useAuthStore } from '../../../../auth/state/authStore';
import { getCalendarEntriesWithStyles } from '../../../utils/CalendarHelpers';
import CalendarEntry from '../../calendar-entries/CalendarEntry';

export default function CalendarWeeklyViewDay({
  date,
  isActive,
  calendarEntries,
}: {
  date: string;
  isActive: boolean;
  calendarEntries: CalendarEntryWithVerticalPosition[];
}) {
  const { auth } = useAuthStore();
  const [currentTimeLineTop, setCurrentTimeLineTop] = useState<number | null>(null);
  const currentTimeLineRef = useRef<HTMLDivElement>(null);

  const generalTimezone = auth?.user?.settings?.generalTimezone ?? 'UTC';
  const totalHeight = CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX * 24;
  const calendarEntriesWithStyles = useMemo(() => {
    return getCalendarEntriesWithStyles(
      calendarEntries,
      date,
      generalTimezone,
      CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX
    );
  }, [calendarEntries, date, generalTimezone]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      const calculateCurrentTimeLineTop = () => {
        const now = new Date();
        const currentMinute = now.getMinutes() + now.getHours() * 60;
        const top = (currentMinute / 1440) * totalHeight;

        setCurrentTimeLineTop(top);
      };

      calculateCurrentTimeLineTop();

      interval = setInterval(() => {
        calculateCurrentTimeLineTop();
      }, 1000 * 60);
    }

    // TODO: Do we really need or want this?
    /*
    if (currentTimeLineRef.current) {
      setTimeout(() => {
        currentTimeLineRef.current?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }, 100);
    }
    */

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, currentTimeLineTop]);

  return (
    <div
      className="relative ml-[-1px] mt-[-1px] w-0 flex-1 flex-grow border border-b-0 border-r-0"
      style={{
        height: totalHeight,
      }}
      data-test="calendar--weekly-view--day"
      data-date={date}
    >
      {calendarEntriesWithStyles.map(({ style, ...calendarEntry }) => {
        return (
          <CalendarEntry
            key={calendarEntry.id}
            calendarEntry={calendarEntry}
            className="absolute"
            style={style}
          />
        );
      })}
      {currentTimeLineTop !== null && (
        <div
          ref={currentTimeLineRef}
          className="absolute w-full"
          style={{
            top: currentTimeLineTop,
          }}
          data-test="calendar--weekly-view--day--current-time-line"
        >
          <div className="relative h-[2px] bg-red-500">
            <div className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
          </div>
        </div>
      )}
    </div>
  );
}

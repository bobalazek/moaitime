import { addMinutes } from 'date-fns';
import { MouseEvent, useEffect, useMemo, useState } from 'react';

import {
  CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX,
  CalendarEntryWithVerticalPosition,
} from '@moaitime/shared-common';

import { useAuthStore } from '../../../../auth/state/authStore';
import { useCalendarStore } from '../../../state/calendarStore';
import { getCalendarEntriesWithStyles } from '../../../utils/CalendarHelpers';
import CalendarEntry from '../../CalendarEntry';
import CalendarWeeklyViewDayCurrentTimeLine from './CalendarWeeklyViewDayCurrentTimeLine';

export type CalendarWeeklyViewDayProps = {
  date: string;
  isActive: boolean;
  calendarEntries: CalendarEntryWithVerticalPosition[];
};

export default function CalendarWeeklyViewDay({
  date,
  isActive,
  calendarEntries,
}: CalendarWeeklyViewDayProps) {
  const { auth } = useAuthStore();
  const { setSelectedCalendarEntryDialogOpen } = useCalendarStore();
  const [currentTimeLineTop, setCurrentTimeLineTop] = useState<number | null>(null);

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

  const onDayContainerClick = (event: MouseEvent) => {
    event.preventDefault();

    const { clientY, target } = event;
    const container = (target as HTMLDivElement).parentElement;
    if (!container) {
      return;
    }

    const rect = container.getBoundingClientRect();
    const relativeTop = clientY - rect.top;
    const hour = Math.floor(relativeTop / CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX);
    const minutes =
      Math.floor((((relativeTop / CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX) % 1) * 60) / 30) * 30;

    let startDate = new Date(date);
    startDate.setHours(hour, minutes, 0, 0);
    startDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000);

    const startsAt = startDate.toISOString().slice(0, -1);
    const endsAt = addMinutes(startDate, 30).toISOString().slice(0, -1);

    setSelectedCalendarEntryDialogOpen(true, {
      startsAt,
      endsAt,
      timezone: generalTimezone,
      // TODO: figure out a more optimal way for this
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  };

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

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, currentTimeLineTop]);

  return (
    <div
      className="relative ml-[-1px] mt-[-1px] w-0 flex-1 flex-grow cursor-pointer border border-b-0 border-r-0"
      style={{
        height: totalHeight,
      }}
      onClick={onDayContainerClick}
      data-test="calendar--weekly-view--day"
      data-date={date}
    >
      {calendarEntriesWithStyles.map(({ style, ...calendarEntry }) => {
        return (
          <CalendarEntry
            key={calendarEntry.id}
            dayDate={date}
            calendarEntry={calendarEntry}
            className="absolute"
            style={style}
            showTimes
          />
        );
      })}
      {currentTimeLineTop !== null && (
        <CalendarWeeklyViewDayCurrentTimeLine top={currentTimeLineTop} />
      )}
    </div>
  );
}

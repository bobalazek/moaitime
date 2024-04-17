import { addMinutes } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { MouseEvent, TouchEvent, useCallback, useEffect, useMemo, useState } from 'react';

import {
  CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX,
  CalendarEntryWithVerticalPosition,
  Event,
} from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../../auth/state/authStore';
import { calendarEventResizingAtom } from '../../../state/calendarAtoms';
import { useEventsStore } from '../../../state/eventsStore';
import { getCalendarEntriesWithStyles, getClientCoordinates } from '../../../utils/CalendarHelpers';
import CalendarEntry from '../../calendar-entry/CalendarEntry';
import CalendarWeeklyViewDayCurrentTimeLine from './CalendarWeeklyViewDayCurrentTimeLine';

export type CalendarWeeklyViewDayProps = {
  date: string;
  isActive: boolean;
  calendarEntries: CalendarEntryWithVerticalPosition[];
};

const animationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -100,
  },
};

const totalHeight = CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX * 24;

export default function CalendarWeeklyViewDay({
  date,
  isActive,
  calendarEntries,
}: CalendarWeeklyViewDayProps) {
  const { setSelectedEventDialogOpen } = useEventsStore();
  const [currentTimeLineTop, setCurrentTimeLineTop] = useState<number | null>(null);
  const calendarEventResizing = useAtomValue(calendarEventResizingAtom);

  const generalTimezone = useAuthUserSetting('generalTimezone', 'UTC');

  const calendarEntriesWithStyles = useMemo(() => {
    return getCalendarEntriesWithStyles(
      calendarEntries,
      date,
      generalTimezone,
      CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX
    );
  }, [calendarEntries, date, generalTimezone]);

  const onDayContainerClick = useCallback(
    (event: MouseEvent | TouchEvent) => {
      const clientCoordinates = getClientCoordinates(event);
      const { target } = event;
      const container = (target as HTMLDivElement).parentElement;
      if (!container || calendarEventResizing) {
        return;
      }

      const rect = container.getBoundingClientRect();
      const relativeTop = clientCoordinates.clientY - rect.top;
      const hour = Math.floor(relativeTop / CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX);
      const minutes =
        Math.floor((((relativeTop / CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX) % 1) * 60) / 30) * 30;

      let startDate = new Date(date);
      startDate.setHours(hour, minutes, 0, 0);
      startDate = new Date(startDate.getTime() - startDate.getTimezoneOffset() * 60 * 1000);

      const startsAt = startDate.toISOString().slice(0, -1);
      const endsAt = addMinutes(startDate, 30).toISOString().slice(0, -1);

      setSelectedEventDialogOpen(true, {
        startsAt,
        endsAt,
        timezone: generalTimezone,
      } as Event);
    },
    [calendarEventResizing, date, generalTimezone, setSelectedEventDialogOpen]
  );

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
      onMouseUp={onDayContainerClick}
      onTouchEnd={onDayContainerClick}
      data-test="calendar--weekly-view--day"
      data-date={date}
    >
      <AnimatePresence>
        {calendarEntriesWithStyles.map(({ style, ...calendarEntry }) => {
          return (
            <motion.div
              key={calendarEntry.id}
              layout
              initial="initial"
              animate="animate"
              exit="exit"
              variants={animationVariants}
              style={{
                position: 'relative',
                zIndex: calendarEventResizing?.id === calendarEntry.id ? 1 : 0,
              }}
            >
              <CalendarEntry
                dayDate={date}
                calendarEntry={calendarEntry}
                className="absolute"
                style={style}
                showTimes
                canResizeAndMove
              />
            </motion.div>
          );
        })}
      </AnimatePresence>
      {currentTimeLineTop !== null && (
        <CalendarWeeklyViewDayCurrentTimeLine top={currentTimeLineTop} />
      )}
    </div>
  );
}

import { addMinutes } from 'date-fns';
import { AnimatePresence, motion } from 'framer-motion';
import { useAtomValue } from 'jotai';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX,
  CalendarEntryWithVerticalPosition,
  Event,
} from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../../auth/state/authStore';
import { calendarEventResizingAtom } from '../../../state/calendarAtoms';
import { useEventsStore } from '../../../state/eventsStore';
import {
  getCalendarEntriesWithStyles,
  getClientCoordinates,
  getThresholdPixels,
  isThresholdReached,
} from '../../../utils/CalendarHelpers';
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

const TOTAL_HEIGHT = CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX * 24;
const MOBILE_THRESHOLD_PIXELS = 10;
const DESKTOP_THRESHOLD_PIXELS = 5;

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

  const onContainerMoveStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      if (event.cancelable) {
        event.preventDefault();
        event.stopPropagation();
      }

      // General
      const isTouchEvent = event.type.startsWith('touch');
      const initialCoordinates = getClientCoordinates(event);

      const onEnd = (event: MouseEvent | TouchEvent) => {
        const { target } = event;

        const container = (target as HTMLDivElement).parentElement;
        if (!container || calendarEventResizing) {
          return;
        }

        const currentCoordinates = getClientCoordinates(event);

        if (isTouchEvent) {
          const hasReachedThreshold = isThresholdReached(
            currentCoordinates,
            initialCoordinates,
            MOBILE_THRESHOLD_PIXELS
          );
          if (hasReachedThreshold) {
            return;
          }
        } else {
          const threshold = getThresholdPixels(currentCoordinates, initialCoordinates);
          if (threshold > DESKTOP_THRESHOLD_PIXELS) {
            return;
          }
        }

        const rect = container.getBoundingClientRect();
        const relativeTop = currentCoordinates.clientY - rect.top;
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

        document.removeEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
      };

      document.addEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
    },
    [calendarEventResizing, date, generalTimezone, setSelectedEventDialogOpen]
  );

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      const calculateCurrentTimeLineTop = () => {
        const now = new Date();
        const currentMinute = now.getMinutes() + now.getHours() * 60;
        const top = (currentMinute / 1440) * TOTAL_HEIGHT;

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

  const containerEvents = {
    onMouseDown: onContainerMoveStart,
    onTouchStart: onContainerMoveStart,
  };

  return (
    <div
      className="relative ml-[-1px] mt-[-1px] w-0 flex-1 flex-grow cursor-pointer border border-b-0 border-r-0"
      style={{
        height: TOTAL_HEIGHT,
      }}
      data-test="calendar--weekly-view--day"
      data-date={date}
      {...containerEvents}
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

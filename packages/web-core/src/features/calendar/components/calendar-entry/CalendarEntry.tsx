import { clsx } from 'clsx';
import { colord } from 'colord';
import { addMinutes } from 'date-fns';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { useAtom } from 'jotai';
import { FlagIcon, GripHorizontalIcon } from 'lucide-react';
import { useCallback } from 'react';

import {
  CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX,
  CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX,
  // Needs to be a different name to the component name itself
  CalendarEntry as CalendarEntryType,
  CalendarEntryTypeEnum,
  Event,
  Task,
} from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { useTasksStore } from '../../../tasks/state/tasksStore';
import { calendarEventResizingAtom, highlightedCalendarEntryAtom } from '../../state/calendarAtoms';
import { useCalendarStore } from '../../state/calendarStore';
import { useEventsStore } from '../../state/eventsStore';
import CalendarEntryTimes from './CalendarEntryTimes';

type Coordinates = {
  clientX: number;
  clientY: number;
};

/**
 * We want to show the "continued" text if the calendar entry is not an all-day event and
 * the start date is not the same as the current/today's date.
 */
const shouldShowContinuedText = (
  calendarEntry: CalendarEntryType,
  timezone: string,
  date?: string
) => {
  if (!date) {
    return false;
  }

  if (calendarEntry.isAllDay) {
    return !calendarEntry.startsAt.includes(date);
  }

  const timezonedDate = formatInTimeZone(calendarEntry.startsAt, timezone, 'yyyy-MM-dd');

  return timezonedDate !== date;
};

/**
 * This is a helper function to check if the end date of a calendar entry is the same as the
 * current/today's date. This is used to determine if we should show the resize handle or not.
 */
const ifIsCalendarEntryEndDateSameAsToday = (
  calendarEntry: CalendarEntryType,
  timezone: string,
  date?: string
) => {
  if (!date) {
    return false;
  }

  const timezonedDate = formatInTimeZone(calendarEntry.endsAt, timezone, 'yyyy-MM-dd');

  return timezonedDate === date;
};

const getClientCoordinates = (
  event: MouseEvent | TouchEvent | React.MouseEvent | React.TouchEvent
) => {
  if (
    typeof (event as MouseEvent).clientX !== 'undefined' &&
    typeof (event as MouseEvent).clientY !== 'undefined'
  ) {
    return {
      clientX: (event as MouseEvent).clientX,
      clientY: (event as MouseEvent).clientY,
    };
  }

  const touch = (event as TouchEvent).touches[0];

  return {
    clientX: touch?.clientX ?? 0,
    clientY: touch?.clientY ?? 0,
  };
};

const getRoundedMinutes = (
  event: MouseEvent | TouchEvent,
  initialCoordinates: Coordinates,
  weekdayWidth?: number
) => {
  const { clientX, clientY } = getClientCoordinates(event);

  let minutesDelta = Math.round(
    ((clientY - initialCoordinates.clientY) / CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX) * 60
  );

  if (weekdayWidth && Math.abs(clientX - initialCoordinates.clientX) > weekdayWidth) {
    minutesDelta += clientX > initialCoordinates.clientX ? 1440 : -1440;
  }

  return Math.round(minutesDelta / 15) * 15;
};

const hasReachedThresholdForMove = (
  event: MouseEvent | TouchEvent,
  initialCoordinates: Coordinates
) => {
  const { clientX, clientY } = getClientCoordinates(event);

  return (
    Math.abs(clientX - initialCoordinates.clientX) > 10 ||
    Math.abs(clientY - initialCoordinates.clientY) > 10
  );
};

export type CalendarEntryProps = {
  calendarEntry: CalendarEntryType;
  dayDate?: string;
  style?: Record<string, unknown>;
  className?: string;
  showTimes?: boolean;
  canResizeAndMove?: boolean;
};

export default function CalendarEntry({
  calendarEntry,
  dayDate,
  style,
  className,
  showTimes,
  canResizeAndMove,
}: CalendarEntryProps) {
  const { setSelectedTaskDialogOpen } = useTasksStore();
  const { setSelectedEventDialogOpen, editEvent } = useEventsStore();
  const { updateCalendaEntry } = useCalendarStore();
  const [highlightedCalendarEntry, setHighlightedCalendarEntry] = useAtom(
    highlightedCalendarEntryAtom
  );
  const [calendarEventResizing, setCalendarEventResizing] = useAtom(calendarEventResizingAtom);

  const generalTimezone = useAuthUserSetting('generalTimezone', 'UTC');
  const showContinuedText = shouldShowContinuedText(calendarEntry, generalTimezone, dayDate);
  const hasAbsoluteClassName = className?.includes('absolute');
  const defaultBackgroundColor = calendarEntry.color ?? '#ffffff';
  const backgroundColor =
    highlightedCalendarEntry?.id === calendarEntry.id
      ? colord(defaultBackgroundColor).darken(0.1).toHex()
      : defaultBackgroundColor;
  const color = colord(backgroundColor).isDark() ? '#ffffff' : '#000000';
  const colorLighter = colord(color).lighten(0.3).toHex();
  const borderColor = colord(backgroundColor).darken(0.1).toHex();
  const innerStyle = {
    borderColor,
    backgroundColor,
    color,
  };

  if (canResizeAndMove) {
    // Do additional checks if we have it enabled
    canResizeAndMove =
      calendarEntry.permissions?.canUpdate &&
      !calendarEntry.isAllDay &&
      ifIsCalendarEntryEndDateSameAsToday(calendarEntry, generalTimezone, dayDate);
  }

  const calendarEntryTitle =
    calendarEntry.type === CalendarEntryTypeEnum.TASK && (calendarEntry.raw as Task).priority ? (
      <span className="flex justify-between gap-2">
        <span>{calendarEntry.title}</span>
        <span className="w-10">
          <FlagIcon size={10} className="inline" /> P{(calendarEntry.raw as Task).priority}
        </span>
      </span>
    ) : (
      calendarEntry.title
    );

  // We don't want to overlap with the next entry
  const finalHeight = style?.height
    ? parseInt(style.height as string) - CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX
    : undefined;
  const containerStyle = style
    ? {
        ...style,
        height: finalHeight
          ? `${
              finalHeight > CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX / 4
                ? finalHeight
                : CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX / 4
            }px`
          : undefined,
      }
    : undefined;

  // Container
  const onContainerMouseEnter = useCallback(() => {
    setHighlightedCalendarEntry(calendarEventResizing ? null : calendarEntry);
  }, [setHighlightedCalendarEntry, calendarEntry, calendarEventResizing]);

  const onContainerMouseLeave = useCallback(() => {
    setHighlightedCalendarEntry(null);
  }, [setHighlightedCalendarEntry]);

  // Resize/move
  const onContainerMoveStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      // Sometimes in the future I will look at this and think "what the hell was I thinking?"
      // Then I will precede and pull my remaining hair out, if, by that time, I still have any left.
      // Timezones are tricky, ok?

      event.stopPropagation();

      const calendarContainer = document.getElementById('calendar');
      const container = (event.target as HTMLDivElement).parentElement;
      if (!container || !style) {
        return;
      }

      const calendarWeekdayElement = document.getElementsByClassName('calendar-week-day')[0];
      const calendarWeekdayWidth = calendarWeekdayElement?.clientWidth ?? 0;

      setCalendarEventResizing(calendarEntry);

      const isTouchEvent = event.type.startsWith('touch');
      const initialCoordinates = getClientCoordinates(event);

      let newStartsAtString = calendarEntry.startsAt;
      let newEndsAtString = calendarEntry.endsAt;

      if (isTouchEvent && calendarContainer) {
        document.body.style.overflow = 'hidden';
        calendarContainer.style.overflow = 'hidden';
      }

      const onMove = (event: MouseEvent | TouchEvent) => {
        const minutesDeltaRounded = getRoundedMinutes(
          event,
          initialCoordinates,
          calendarWeekdayWidth
        );

        // Starts At
        const newStartsAt = addMinutes(new Date(calendarEntry.startsAt), minutesDeltaRounded);
        const newStartsAtUtc = zonedTimeToUtc(newStartsAt, calendarEntry.timezone).toISOString();
        newStartsAtString = newStartsAt.toISOString();

        // Ends At
        const newEndsAt = addMinutes(new Date(calendarEntry.endsAt), minutesDeltaRounded);
        const newEndsAtUtc = zonedTimeToUtc(
          newEndsAt,
          calendarEntry.endTimezone ?? calendarEntry.timezone
        ).toISOString();
        newEndsAtString = newEndsAt.toISOString();

        updateCalendaEntry({
          ...calendarEntry,
          startsAt: newStartsAtString,
          startsAtUtc: newStartsAtUtc,
          endsAt: newEndsAtString,
          endsAtUtc: newEndsAtUtc,
        });
      };

      const onEnd = async (event: MouseEvent | TouchEvent) => {
        if (isTouchEvent && calendarContainer) {
          document.body.style.overflow = 'auto';
          calendarContainer.style.overflow = 'auto';
        }

        document.removeEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
        document.removeEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);

        if (!hasReachedThresholdForMove(event, initialCoordinates)) {
          if (calendarEntry.type === CalendarEntryTypeEnum.EVENT) {
            setSelectedEventDialogOpen(true, calendarEntry.raw as Event);
          } else if (calendarEntry.type === CalendarEntryTypeEnum.TASK) {
            setSelectedTaskDialogOpen(true, calendarEntry.raw as Task);
          }

          return;
        }

        // For some reason we are sending the endsAt as local time, not UTC,
        // but it still has a "Z" at the end. This seems to be happening on multiple places,
        // so DO NOT CHANGE THIS, else it could have negative side effects on other places.
        // The reason is, that the database stores the local time and omits the timezone.
        // What we basically do here is us getting the "correct" (local) time, with just the
        // "Z" at the end, even though it's not UTC.
        const finalStartsAt = zonedTimeToUtc(newStartsAtString, 'UTC').toISOString();
        const finalEndsAt = zonedTimeToUtc(newEndsAtString, 'UTC').toISOString();

        await editEvent(calendarEntry.raw!.id, {
          ...calendarEntry.raw,
          startsAt: finalStartsAt,
          endsAt: finalEndsAt,
        } as Event);

        // To make sure the onClick event has been fired, to prevent opening the dialog
        setTimeout(() => {
          setCalendarEventResizing(null);
        }, 200);
      };

      document.addEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
      document.addEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
    },
    [
      calendarEntry,
      style,
      setCalendarEventResizing,
      updateCalendaEntry,
      editEvent,
      setSelectedEventDialogOpen,
      setSelectedTaskDialogOpen,
    ]
  );

  const onBottomResizeHandleStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      event.stopPropagation();

      const calendarContainer = document.getElementById('calendar');
      const container = (event.target as HTMLDivElement).parentElement;
      if (!container || !style) {
        return;
      }

      setCalendarEventResizing(calendarEntry);

      const isTouchEvent = event.type.startsWith('touch');
      const initialCoordinates = getClientCoordinates(event);
      let newEndsAtString = calendarEntry.endsAt;

      if (isTouchEvent && calendarContainer) {
        document.body.style.overflow = 'hidden';
        calendarContainer.style.overflow = 'hidden';
      }

      const onMove = (event: MouseEvent | TouchEvent) => {
        const minutesDeltaRounded = getRoundedMinutes(event, initialCoordinates);

        const newEndsAt = addMinutes(new Date(calendarEntry.endsAt), minutesDeltaRounded);
        const newEndsAtUtc = zonedTimeToUtc(
          newEndsAt,
          calendarEntry.endTimezone ?? calendarEntry.timezone
        ).toISOString();

        if (newEndsAt < new Date(calendarEntry.startsAtUtc)) {
          return;
        }

        newEndsAtString = newEndsAt.toISOString();

        updateCalendaEntry({
          ...calendarEntry,
          endsAt: newEndsAtString,
          endsAtUtc: newEndsAtUtc,
        });
      };

      const onEnd = async () => {
        if (isTouchEvent && calendarContainer) {
          document.body.style.overflow = 'auto';
          calendarContainer.style.overflow = 'auto';
        }

        document.removeEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
        document.removeEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);

        // Same as above
        const finalEndsAt = zonedTimeToUtc(newEndsAtString, 'UTC').toISOString();
        await editEvent(calendarEntry.raw!.id, {
          ...calendarEntry.raw,
          endsAt: finalEndsAt,
        } as Event);

        // To make sure the onClick event has been fired, to prevent opening the dialog
        setTimeout(() => {
          setCalendarEventResizing(null);
        }, 200);
      };

      document.addEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
      document.addEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
    },
    [calendarEntry, style, setCalendarEventResizing, updateCalendaEntry, editEvent]
  );

  return (
    <div
      key={calendarEntry.id}
      className={clsx('select-none px-[2px]', !hasAbsoluteClassName && 'relative', className)}
      style={containerStyle}
      title={calendarEntry.title}
      onMouseDown={canResizeAndMove ? onContainerMoveStart : undefined}
      onTouchStart={canResizeAndMove ? onContainerMoveStart : undefined}
      onMouseEnter={onContainerMouseEnter}
      onMouseLeave={onContainerMouseLeave}
      data-test="calendar--weekly-view--day--calendar-entry"
    >
      <div
        className="relative h-full cursor-pointer overflow-hidden rounded-lg border border-transparent px-2 py-1 text-xs transition-all"
        data-test="calendar--weekly-view--day--calendar-entry--content"
        style={innerStyle}
      >
        <h4
          className="overflow-auto break-words font-bold"
          data-test="calendar--weekly-view--day--calendar-entry--title"
        >
          {calendarEntryTitle}
          {showContinuedText && (
            <span
              className="text-[0.65rem] transition-all"
              style={{
                color: colorLighter,
              }}
            >
              {' '}
              (cont.)
            </span>
          )}
        </h4>
        {showTimes && (
          <div className="break-words text-[0.65rem] font-semibold">
            <CalendarEntryTimes calendarEntry={calendarEntry} />
          </div>
        )}
        {canResizeAndMove && (
          <div className="absolute bottom-[4px] left-0 w-full">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-s-resize text-white"
              onMouseDown={onBottomResizeHandleStart}
              onTouchStart={onBottomResizeHandleStart}
              style={{
                color: colorLighter,
              }}
              data-test="calendar--weekly-view--day--calendar-entry--resize-handle"
            >
              <GripHorizontalIcon size={14} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

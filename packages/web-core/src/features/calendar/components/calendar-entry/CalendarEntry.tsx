import { clsx } from 'clsx';
import { colord } from 'colord';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useAtom } from 'jotai';
import { debounce } from 'lodash';
import { FlagIcon, GripHorizontalIcon } from 'lucide-react';
import { useCallback } from 'react';

import {
  CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX,
  // Needs to be a different name to the component name itself
  CalendarEntry as CalendarEntryType,
  CalendarEntryTypeEnum,
  CalendarViewEnum,
  Event,
  Task,
} from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { getTextColor } from '../../../core/utils/ColorHelpers';
import { useTasksStore } from '../../../tasks/state/tasksStore';
import { calendarEventResizingAtom, highlightedCalendarEntryAtom } from '../../state/calendarAtoms';
import { useCalendarStore } from '../../state/calendarStore';
import { useEventsStore } from '../../state/eventsStore';
import {
  adjustStartAndEndDates,
  getClientCoordinates,
  getRoundedMinutes,
  hasReachedThresholdForMove,
  ifIsCalendarEntryEndDateSameAsToday,
  shouldShowContinuedText,
} from '../../utils/CalendarHelpers';
import CalendarEntryTimes from './CalendarEntryTimes';

const DEBOUNCE_UPDATE_TIME = 50;

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
  const { selectedView, updateCalendarEntry } = useCalendarStore();
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
  const color = getTextColor(backgroundColor)!;
  const colorLighter = colord(color).lighten(0.3).toHex();
  const borderColor = colord(backgroundColor).darken(0.1).toHex();
  const innerStyle = {
    borderColor,
    backgroundColor,
    color,
  };

  let canResizeEndHandler = canResizeAndMove;
  if (canResizeAndMove) {
    canResizeAndMove = calendarEntry.permissions?.canUpdate;
    canResizeEndHandler = selectedView !== CalendarViewEnum.MONTH;
    canResizeAndMove &&
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

  const debouncedUpdateCalendarEntry = debounce(updateCalendarEntry, DEBOUNCE_UPDATE_TIME, {
    maxWait: DEBOUNCE_UPDATE_TIME,
  });

  // Resize/move
  const onContainerMoveStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      // Sometimes in the future I will look at this and think "what the hell was I thinking?"
      // Then I will precede and pull my remaining hair out, if, by that time, I still have any left.
      // Timezones are tricky, ok?

      event.stopPropagation();

      // If we can't resize or move, we still want to keep the onClick functionality,
      // that opens the dialog of that entry.
      if (!canResizeAndMove) {
        if (calendarEntry.type === CalendarEntryTypeEnum.EVENT) {
          setSelectedEventDialogOpen(true, calendarEntry.raw as Event);
        } else if (calendarEntry.type === CalendarEntryTypeEnum.TASK) {
          setSelectedTaskDialogOpen(true, calendarEntry.raw as Task);
        }

        return;
      }

      const calendarContainer = document.getElementById('calendar');
      const container = (event.target as HTMLDivElement).parentElement;
      if (!container) {
        return;
      }

      setCalendarEventResizing(calendarEntry);

      // Weekly/Daily
      // Figure out what the width of a weekday is, so when we move left/right,
      // we know when we jumped to the next/previous day.
      // Let's just get the first day, as they all should have the same width.
      const calendarDays = Array.from(document.querySelectorAll('div[data-calendar-day]'));

      let calendarWeekdayWidth = 0;
      if (selectedView !== CalendarViewEnum.MONTH) {
        calendarWeekdayWidth = calendarDays[0].clientWidth ?? 0;
      }

      // Monthly
      const calendarDaysOfMonthCoords: { date: string; rect: DOMRect }[] = [];
      if (selectedView == CalendarViewEnum.MONTH) {
        for (const day of calendarDays) {
          calendarDaysOfMonthCoords.push({
            date: day.getAttribute('data-calendar-day')!,
            rect: day.getBoundingClientRect(),
          });
        }
      }

      // Touch stuff
      const isTouchEvent = event.type.startsWith('touch');
      const initialCoordinates = getClientCoordinates(event);

      let minutesDelta = 0;
      let currentDayDate = dayDate;

      if (isTouchEvent && calendarContainer) {
        document.body.style.overflow = 'hidden';
        calendarContainer.style.overflow = 'hidden';
      }

      const onMove = (event: MouseEvent | TouchEvent) => {
        let minutesDeltaRounded = 0;

        if (selectedView === CalendarViewEnum.MONTH) {
          const { clientX, clientY } = getClientCoordinates(event);

          // Find the day we are currently hovering over
          const hoveredDay = calendarDaysOfMonthCoords.find((day) => {
            return (
              clientX >= day.rect.left &&
              clientX <= day.rect.right &&
              clientY >= day.rect.top &&
              clientY <= day.rect.bottom
            );
          });

          if (hoveredDay && currentDayDate !== hoveredDay.date) {
            currentDayDate = hoveredDay.date;
          }

          const millisecondsDelta =
            new Date(currentDayDate!).getTime() - new Date(dayDate!).getTime();
          minutesDeltaRounded = Math.round(millisecondsDelta / 60000);
        } else {
          minutesDeltaRounded = getRoundedMinutes(event, initialCoordinates, calendarWeekdayWidth);
        }

        try {
          const { startsAt, startsAtUtc, endsAt, endsAtUtc } = adjustStartAndEndDates(
            calendarEntry,
            minutesDeltaRounded
          );

          minutesDelta = minutesDeltaRounded;

          debouncedUpdateCalendarEntry({
            ...calendarEntry,
            startsAt,
            startsAtUtc,
            endsAt,
            endsAtUtc,
          });
        } catch (error) {
          // Nothing to do - the start time is probably before the end time
        }
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

          // Not really sure why this is needed, but it is.
          // Too tired to determine where the problem is,
          // but it seems something related with event propagation somewhere.
          setTimeout(() => {
            setCalendarEventResizing(null);
          }, 200);

          return;
        }

        if (minutesDelta !== 0) {
          const { startsAt, endsAt } = adjustStartAndEndDates(
            calendarEntry.raw as Event,
            minutesDelta
          );
          const startsAtString = zonedTimeToUtc(startsAt, 'UTC').toISOString();
          const endsAtString = zonedTimeToUtc(endsAt, 'UTC').toISOString();

          await editEvent(calendarEntry.raw!.id, {
            ...calendarEntry.raw,
            startsAt: startsAtString,
            endsAt: endsAtString,
          } as Event);
        }

        // To make sure the onClick event has been fired, to prevent opening the dialog
        setTimeout(() => {
          setCalendarEventResizing(null);
        }, 200);
      };

      document.addEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
      document.addEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
    },
    [
      canResizeAndMove,
      calendarEntry,
      selectedView,
      dayDate,
      editEvent,
      setCalendarEventResizing,
      setSelectedEventDialogOpen,
      setSelectedTaskDialogOpen,
      debouncedUpdateCalendarEntry,
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
      let minutesDelta = 0;

      if (isTouchEvent && calendarContainer) {
        document.body.style.overflow = 'hidden';
        calendarContainer.style.overflow = 'hidden';
      }

      const onMove = (event: MouseEvent | TouchEvent) => {
        const minutesDeltaRounded = getRoundedMinutes(event, initialCoordinates);

        try {
          const { endsAt, endsAtUtc } = adjustStartAndEndDates(
            calendarEntry,
            minutesDeltaRounded,
            'end_only'
          );

          debouncedUpdateCalendarEntry({
            ...calendarEntry,
            endsAt,
            endsAtUtc,
          });

          minutesDelta = minutesDeltaRounded;
        } catch (error) {
          // Nothing to do - the start time is probably before the end time
        }
      };

      const onEnd = async () => {
        if (isTouchEvent && calendarContainer) {
          document.body.style.overflow = 'auto';
          calendarContainer.style.overflow = 'auto';
        }

        document.removeEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
        document.removeEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);

        // Same as above
        if (minutesDelta !== 0) {
          const { endsAt } = adjustStartAndEndDates(
            calendarEntry.raw as Event,
            minutesDelta,
            'end_only'
          );
          const endsAtString = zonedTimeToUtc(endsAt, 'UTC').toISOString();

          await editEvent(calendarEntry.raw!.id, {
            ...calendarEntry.raw,
            endsAt: endsAtString,
          } as Event);
        }

        // To make sure the onClick event has been fired, to prevent opening the dialog
        setTimeout(() => {
          setCalendarEventResizing(null);
        }, 200);
      };

      document.addEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
      document.addEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);
    },
    [style, calendarEntry, setCalendarEventResizing, editEvent, debouncedUpdateCalendarEntry]
  );

  return (
    <div
      key={calendarEntry.id}
      className={clsx('select-none px-[2px]', !hasAbsoluteClassName && 'relative', className)}
      style={containerStyle}
      title={calendarEntry.title}
      onMouseDown={onContainerMoveStart}
      onTouchStart={onContainerMoveStart}
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
        {canResizeEndHandler && (
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

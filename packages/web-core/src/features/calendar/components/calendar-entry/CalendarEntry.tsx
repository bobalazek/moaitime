import { clsx } from 'clsx';
import { colord } from 'colord';
import { zonedTimeToUtc } from 'date-fns-tz';
import { useAtom } from 'jotai';
import { debounce } from 'lodash';
import { FlagIcon, GripHorizontalIcon, LockIcon } from 'lucide-react';
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
  getCalendarViewWidths,
  getClientCoordinates,
  getRoundedMinutesFromCoordinates,
  ifIsCalendarEntryEndDateSameAsToday,
  isThresholdReached,
  shouldShowContinuedText,
} from '../../utils/CalendarHelpers';
import CalendarEntryTimes from './CalendarEntryTimes';

const DEBOUNCE_UPDATE_TIME = 50;

// Scroll
let _scrollLocked = false;
const lockScroll = (isTouchEvent: boolean) => {
  if (!isTouchEvent || _scrollLocked) {
    return;
  }

  document.body.style.overflow = 'hidden';

  const calendarContainer = document.getElementById('calendar');
  if (calendarContainer) {
    calendarContainer.style.overflow = 'hidden';
  }

  _scrollLocked = true;
};

const unlockScroll = (isTouchEvent: boolean) => {
  if (!isTouchEvent || !_scrollLocked) {
    return;
  }

  document.body.style.overflow = 'auto';

  const calendarContainer = document.getElementById('calendar');
  if (calendarContainer) {
    calendarContainer.style.overflow = 'auto';
  }

  _scrollLocked = false;
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
    highlightedCalendarEntry?.raw?.id === calendarEntry.raw?.id
      ? colord(defaultBackgroundColor).darken(0.15).toHex()
      : defaultBackgroundColor;
  const color = getTextColor(backgroundColor)!;
  const colorLighter = colord(color).lighten(0.3).toHex();
  const borderColor = colord(backgroundColor).darken(0.1).toHex();
  const innerStyle = {
    borderColor,
    backgroundColor,
    color,
  };

  // For now, we are only allowing to resize and move events, not tasks
  if (calendarEntry.type !== CalendarEntryTypeEnum.EVENT) {
    canResizeAndMove = false;
  }

  let canResizeEndHandler = canResizeAndMove;
  if (canResizeAndMove) {
    canResizeAndMove = calendarEntry.permissions?.canUpdate;
    canResizeEndHandler =
      selectedView !== CalendarViewEnum.MONTH &&
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

      // General
      const isTouchEvent = event.type.startsWith('touch');
      const initialCoordinates = getClientCoordinates(event);
      const { calendarWeekdayWidth, calendarDaysOfMonthCoords } =
        getCalendarViewWidths(selectedView);

      let currentCoordinates = initialCoordinates;
      let isDraggable = !isTouchEvent;
      let minutesDelta = 0;
      let currentDayDate = dayDate;

      if (isTouchEvent) {
        setTimeout(() => {
          const hasReachedThreshold = isThresholdReached(
            currentCoordinates,
            initialCoordinates,
            10
          );
          if (hasReachedThreshold) {
            return;
          }

          isDraggable = true;
          lockScroll(isTouchEvent);
          setCalendarEventResizing(calendarEntry);
        }, 200);
      } else {
        lockScroll(isTouchEvent);
        setCalendarEventResizing(calendarEntry);
      }

      // Helpers
      const openEventOrTaskDialog = () => {
        if (calendarEntry.type === CalendarEntryTypeEnum.EVENT) {
          setSelectedEventDialogOpen(true, calendarEntry.raw as Event);
        } else if (calendarEntry.type === CalendarEntryTypeEnum.TASK) {
          setSelectedTaskDialogOpen(true, calendarEntry.raw as Task);
        }
      };

      // Events
      const onMove = (event: MouseEvent | TouchEvent) => {
        if (event.cancelable) {
          event.preventDefault();
          event.stopPropagation();
        }

        currentCoordinates = getClientCoordinates(event);

        if (!canResizeAndMove || !isDraggable) {
          return;
        }

        let minutesDeltaRounded = 0;

        if (selectedView === CalendarViewEnum.MONTH) {
          // Find the day we are currently hovering over
          const hoveredDay = calendarDaysOfMonthCoords.find((day) => {
            return (
              currentCoordinates.clientX >= day.rect.left &&
              currentCoordinates.clientX <= day.rect.right &&
              currentCoordinates.clientY >= day.rect.top &&
              currentCoordinates.clientY <= day.rect.bottom
            );
          });

          if (hoveredDay && currentDayDate !== hoveredDay.date) {
            currentDayDate = hoveredDay.date;
          }

          const millisecondsDelta =
            new Date(currentDayDate!).getTime() - new Date(dayDate!).getTime();
          minutesDeltaRounded = Math.round(millisecondsDelta / 60000);
        } else {
          minutesDeltaRounded = getRoundedMinutesFromCoordinates(
            currentCoordinates,
            initialCoordinates,
            calendarWeekdayWidth
          );
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
        unlockScroll(isTouchEvent);

        setCalendarEventResizing(null);

        document.removeEventListener(isTouchEvent ? 'touchmove' : 'mousemove', onMove);
        document.removeEventListener(isTouchEvent ? 'touchend' : 'mouseup', onEnd);

        const currentCoordinates = getClientCoordinates(event);
        const hasReachedThreshold = isThresholdReached(currentCoordinates, initialCoordinates, 10);
        if (!hasReachedThreshold) {
          openEventOrTaskDialog();
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

  const onBottomResizeHandleMoveStart = useCallback(
    (event: React.MouseEvent | React.TouchEvent) => {
      event.preventDefault();
      event.stopPropagation();

      // General
      const isTouchEvent = event.type.startsWith('touch');
      const initialCoordinates = getClientCoordinates(event);

      let minutesDelta = 0;

      lockScroll(isTouchEvent);

      setCalendarEventResizing(calendarEntry);

      // Events
      const onMove = (event: MouseEvent | TouchEvent) => {
        if (event.cancelable) {
          event.preventDefault();
          event.stopPropagation();
        }

        const currentCoordinates = getClientCoordinates(event);
        const minutesDeltaRounded = getRoundedMinutesFromCoordinates(
          currentCoordinates,
          initialCoordinates
        );

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
        unlockScroll(isTouchEvent);

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
    [calendarEntry, setCalendarEventResizing, editEvent, debouncedUpdateCalendarEntry]
  );

  const containerEvents = {
    onMouseDown: onContainerMoveStart,
    onTouchStart: onContainerMoveStart,
    onMouseEnter: onContainerMouseEnter,
    onMouseLeave: onContainerMouseLeave,
  };

  return (
    <div
      key={calendarEntry.id}
      className={clsx(
        'select-none px-[2px]',
        !hasAbsoluteClassName && 'relative',
        calendarEventResizing?.id === calendarEntry.id && 'animate-shake',
        className
      )}
      style={containerStyle}
      title={calendarEntry.title}
      data-test="calendar--weekly-view--day--calendar-entry"
      {...containerEvents}
    >
      <div
        className="relative h-full cursor-pointer overflow-hidden rounded-lg border border-transparent py-1 pl-2 pr-4 text-xs transition-all"
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
              onMouseDown={onBottomResizeHandleMoveStart}
              onTouchStart={onBottomResizeHandleMoveStart}
              style={{
                color: colorLighter,
              }}
              data-test="calendar--weekly-view--day--calendar-entry--resize-handle"
            >
              <GripHorizontalIcon size={14} />
            </div>
          </div>
        )}
        {!canResizeAndMove && (
          <LockIcon size={10} strokeWidth={4} className="absolute right-[2px] top-[2px]" />
        )}
      </div>
    </div>
  );
}

import { clsx } from 'clsx';
import { colord } from 'colord';
import { addMinutes } from 'date-fns';
import { formatInTimeZone, zonedTimeToUtc } from 'date-fns-tz';
import { useAtom } from 'jotai';
import { FlagIcon, GripHorizontalIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX,
  CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX,
  // Needs to be a different name to the component name itself
  CalendarEntry as CalendarEntryType,
  CalendarEntryTypeEnum,
  CalendarEntryWithVerticalPosition,
  Event,
  Task,
} from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { useTasksStore } from '../../../tasks/state/tasksStore';
import { calendarEventIsResizingAtom } from '../../state/calendarAtoms';
import { useCalendarHighlightedCalendarEntryStore } from '../../state/calendarDynamicStore';
import { useEventsStore } from '../../state/eventsStore';
import { getCalendarEntriesWithStyles } from '../../utils/CalendarHelpers';
import CalendarEntryTimes from './CalendarEntryTimes';

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

export type CalendarEntryProps = {
  calendarEntry: CalendarEntryType;
  dayDate?: string;
  style?: Record<string, unknown>;
  className?: string;
  showTimes?: boolean;
  showBottomResizeHandle?: boolean;
};

export default function CalendarEntry({
  calendarEntry: rawCalendarEntry,
  dayDate,
  style: rawStyle,
  className,
  showTimes,
  showBottomResizeHandle,
}: CalendarEntryProps) {
  const { setSelectedTaskDialogOpen } = useTasksStore();
  const { setSelectedEventDialogOpen, editEvent } = useEventsStore();
  const { setHighlightedCalendarEntry, highlightedCalendarEntry } =
    useCalendarHighlightedCalendarEntryStore();
  const [calendarEntry, setCalendarEntry] = useState(rawCalendarEntry);
  const [style, setStyle] = useState(rawStyle);
  const [calendarEventIsResizing, setCalendarEventIsResizing] = useAtom(
    calendarEventIsResizingAtom
  );

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

  useEffect(() => {
    setCalendarEntry(rawCalendarEntry);
    setStyle(rawStyle);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rawCalendarEntry.raw?.updatedAt]);

  // Container
  const onContainerClick = (event: React.MouseEvent, calendarEntry: CalendarEntryType) => {
    event.preventDefault();
    event.stopPropagation();

    if (calendarEventIsResizing) {
      return;
    }

    if (calendarEntry.type === CalendarEntryTypeEnum.EVENT) {
      setSelectedEventDialogOpen(true, calendarEntry.raw as Event);
    } else if (calendarEntry.type === CalendarEntryTypeEnum.TASK) {
      setSelectedTaskDialogOpen(true, calendarEntry.raw as Task);
    }
  };

  const onContainerMouseEnter = () => {
    setHighlightedCalendarEntry(calendarEntry);
  };

  const onContainerMouseLeave = () => {
    setHighlightedCalendarEntry(null);
  };

  // Resize
  const onResizeHandleMouseDown = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    // Sometime in the future I will look at this and think "what the hell was I thinking?"
    // Then I will precede and pull my remaining hair out, if, by that time, I still have any left.
    // Timezones are tricky, ok?

    const container = (event.target as HTMLDivElement).parentElement;
    if (!container || !style) {
      return;
    }

    setCalendarEventIsResizing(true);

    const initialClientY = event.clientY;
    let newCalendarEntryEndsAt = calendarEntry.endsAt;

    const onMouseMove = (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      const currentClientY = event.clientY;

      const minutesDelta = Math.round(
        ((currentClientY - initialClientY) / CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX) * 60
      );
      const minutesDeltaRounded = Math.round(minutesDelta / 15) * 15;

      newCalendarEntryEndsAt = addMinutes(
        new Date(calendarEntry.endsAt),
        minutesDeltaRounded
      ).toISOString();
      const newEndsAtUtc = zonedTimeToUtc(
        newCalendarEntryEndsAt,
        calendarEntry.endTimezone ?? calendarEntry.timezone
      ).toISOString();

      const calendarEntries: CalendarEntryWithVerticalPosition[] = [
        {
          ...calendarEntry,
          endsAt: newCalendarEntryEndsAt,
          endsAtUtc: newEndsAtUtc,
          left: style.left as string,
          width: style.width as string,
        },
      ];

      const { style: newStyle, ...newCalendarEntry } = getCalendarEntriesWithStyles(
        calendarEntries,
        dayDate!,
        generalTimezone,
        CALENDAR_WEEKLY_VIEW_HOUR_HEIGHT_PX
      )[0];

      setStyle(newStyle);
      setCalendarEntry(newCalendarEntry);
    };

    const onMouseUp = async (event: MouseEvent) => {
      event.preventDefault();
      event.stopPropagation();

      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);

      // For some reason we are sending the endsAt as local time, not UTC,
      // but it still has a "Z" at the end. This seems to be happening on multiple places,
      // so DO NOT CHANGE THIS, else it could have negative side effects on other places.
      // The reason is, that the database stores the local time and omits the timezone.
      // What we basically do here is us getting the "correct" (local) time, with just the
      // "Z" at the end, even though it's not UTC.
      const finalEndsAt = zonedTimeToUtc(newCalendarEntryEndsAt, 'UTC').toISOString();
      await editEvent(calendarEntry.raw!.id, {
        ...calendarEntry.raw,
        endsAt: finalEndsAt,
      } as Event);

      // To make sure the onClick event has been fired, to prevent opening the dialog
      setTimeout(() => {
        setCalendarEventIsResizing(false);
      }, 100);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  };

  return (
    <div
      key={calendarEntry.id}
      className={clsx('select-none px-[2px]', !hasAbsoluteClassName && 'relative', className)}
      style={containerStyle}
      title={calendarEntry.title}
      onClick={(event) => onContainerClick(event, calendarEntry)}
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
        {showBottomResizeHandle && (
          <div className="absolute bottom-[4px] left-0 w-full">
            <div
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-s-resize text-white"
              onMouseDown={onResizeHandleMouseDown}
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

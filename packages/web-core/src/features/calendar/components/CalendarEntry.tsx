import { clsx } from 'clsx';
import { colord } from 'colord';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import { MouseEvent } from 'react';

import {
  CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX,
  CalendarEntry as CalendarEntryType, // Needs to be a different name to the component name itself
} from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import { useCalendarHighlightedCalendarEntryStore } from '../state/calendarHighlightedCalendarEntryStore';
import { useCalendarStore } from '../state/calendarStore';

const shouldShowContinuedText = (
  calendarEntry: CalendarEntryType,
  timezone: string,
  dayDate?: string
) => {
  if (!dayDate) {
    return false;
  }

  if (calendarEntry.isAllDay) {
    return !calendarEntry.startsAt.includes(dayDate);
  }

  const timezonedFormat = formatInTimeZone(calendarEntry.startsAt, timezone, 'yyyy-MM-dd');

  return timezonedFormat !== dayDate;
};

export type CalendarEntryProps = {
  calendarEntry: CalendarEntryType;
  dayDate?: string;
  style?: Record<string, unknown>;
  className?: string;
  showTimes?: boolean;
};

export default function CalendarEntry({
  calendarEntry,
  dayDate,
  style,
  className,
  showTimes,
}: CalendarEntryProps) {
  const { auth } = useAuthStore();
  const { calendars, setSelectedCalendarEntryDialogOpen } = useCalendarStore();
  const { setHighlightedCalendarEntry, highlightedCalendarEntry } =
    useCalendarHighlightedCalendarEntryStore();

  const generalTimezone = auth?.user?.settings?.generalTimezone ?? 'UTC';
  const clockUse24HourClock = auth?.user?.settings?.clockUse24HourClock ?? false;
  const showContinuedText = shouldShowContinuedText(calendarEntry, generalTimezone, dayDate);
  const hasAbsoluteClassName = className?.includes('absolute');
  const calendar = calendars.find((c) => c.id === calendarEntry.calendarId);
  const defaultBackgroundColor = calendarEntry.color ?? calendar?.color ?? '#ffffff';
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

  const startTime = utcToZonedTime(calendarEntry.startsAtUtc, generalTimezone).toLocaleString(
    'default',
    {
      minute: '2-digit',
      hour: '2-digit',
      hour12: !clockUse24HourClock,
    }
  );
  const endTime = utcToZonedTime(calendarEntry.endsAtUtc, generalTimezone).toLocaleString(
    'default',
    {
      minute: '2-digit',
      hour: '2-digit',
      hour12: !clockUse24HourClock,
    }
  );

  const containerStyle = style
    ? {
        ...style,
        height: `${
          parseInt(style.height as string, 10) - CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX
        }px`, // We don't want to overlap with the next entry
      }
    : undefined;

  const onClick = (event: MouseEvent, calendarEntry: CalendarEntryType) => {
    event.preventDefault();
    event.stopPropagation();

    setSelectedCalendarEntryDialogOpen(true, calendarEntry);
  };

  const onMouseEnter = () => {
    setHighlightedCalendarEntry(calendarEntry);
  };

  const onMouseLeave = () => {
    setHighlightedCalendarEntry(null);
  };

  return (
    <div
      key={calendarEntry.id}
      className={clsx('select-none px-[2px]', !hasAbsoluteClassName && 'relative', className)}
      style={containerStyle}
      title={calendarEntry.title}
      onClick={(event) => onClick(event, calendarEntry)}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      data-test="calendar--weekly-view--day--calendar-entry"
    >
      <div
        className="h-full cursor-pointer overflow-hidden rounded-lg border border-transparent px-2 py-1 text-xs transition-all"
        data-test="calendar--weekly-view--day--calendar-entry--content"
        style={innerStyle}
      >
        <h4
          className="overflow-auto break-words font-bold"
          data-test="calendar--weekly-view--day--calendar-entry--title"
        >
          {calendarEntry.title}
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
            {startTime} - {endTime}
          </div>
        )}
      </div>
    </div>
  );
}

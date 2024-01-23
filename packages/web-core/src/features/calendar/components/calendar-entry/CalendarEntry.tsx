import { clsx } from 'clsx';
import { colord } from 'colord';
import { formatInTimeZone } from 'date-fns-tz';
import { FlagIcon, GripHorizontalIcon } from 'lucide-react';
import { MouseEvent } from 'react';

import {
  CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX,
  // Needs to be a different name to the component name itself
  CalendarEntry as CalendarEntryType,
  CalendarEntryTypeEnum,
  Event,
  Task,
} from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { useTasksStore } from '../../../tasks/state/tasksStore';
import { useCalendarHighlightedCalendarEntryStore } from '../../state/calendarDynamicStore';
import { useEventsStore } from '../../state/eventsStore';
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
  calendarEntry,
  dayDate,
  style,
  className,
  showTimes,
  showBottomResizeHandle,
}: CalendarEntryProps) {
  const { setSelectedTaskDialogOpen } = useTasksStore();
  const { setSelectedEventDialogOpen } = useEventsStore();
  const { setHighlightedCalendarEntry, highlightedCalendarEntry } =
    useCalendarHighlightedCalendarEntryStore();

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

  const containerStyle = style
    ? {
        ...style,
        height: `${parseInt(style.height as string) - CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX}px`, // We don't want to overlap with the next entry
      }
    : undefined;

  // Container
  const onContainerClick = (event: MouseEvent, calendarEntry: CalendarEntryType) => {
    event.preventDefault();
    event.stopPropagation();

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
  // TODO

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
          <div
            className="absolute bottom-[4px] left-0 w-full"
            data-test="calendar--weekly-view--day--calendar-entry--resize-handle"
          >
            <GripHorizontalIcon
              size={14}
              className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform cursor-s-resize text-white"
              style={{
                color: colorLighter,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}

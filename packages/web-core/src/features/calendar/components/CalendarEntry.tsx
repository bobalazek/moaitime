import { clsx } from 'clsx';
import { colord } from 'colord';
import { MouseEvent, useState } from 'react';

import {
  CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX,
  CalendarEntry as CalendarEntryType, // Needs to be a different name to the component name itself
} from '@moaitime/shared-common';

import { useCalendarStore } from '../state/calendarStore';

export default function CalendarEntry({
  calendarEntry,
  style,
  className,
}: {
  calendarEntry: CalendarEntryType;
  style?: Record<string, unknown>;
  className?: string;
}) {
  const { setSelectedCalendarEntryDialogOpen } = useCalendarStore();
  const [isHover, setIsHover] = useState(false);

  const hasAbsoluteClassName = className?.includes('absolute');
  const defaultBackgroundColor = '#ffffff';
  const backgroundColor = isHover
    ? colord(defaultBackgroundColor).darken(0.1).toHex()
    : defaultBackgroundColor;
  const color = colord(backgroundColor).isDark() ? '#ffffff' : '#000000';
  const borderColor = colord(backgroundColor).darken(0.2).toHex();
  const innerStyle = {
    borderColor,
    backgroundColor,
    color,
  };

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

  return (
    <div
      key={calendarEntry.id}
      className={clsx('select-none px-[2px]', !hasAbsoluteClassName && 'relative', className)}
      style={containerStyle}
      title={calendarEntry.title}
      onClick={(event) => onClick(event, calendarEntry)}
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      data-test="calendar--weekly-view--day--calendar-entry"
    >
      <div
        className="h-full cursor-pointer rounded-lg border border-transparent px-2 py-1 text-xs transition-all"
        data-test="calendar--weekly-view--day--calendar-entry--content"
        style={innerStyle}
      >
        <h4
          className="overflow-auto break-words font-bold"
          data-test="calendar--weekly-view--day--calendar-entry--title"
        >
          {calendarEntry.title}
        </h4>
      </div>
    </div>
  );
}

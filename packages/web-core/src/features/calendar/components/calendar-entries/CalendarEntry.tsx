import { clsx } from 'clsx';

import {
  CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX,
  CalendarEntry as CalendarEntryType, // Needs to be a different name to the component name itself
} from '@moaitime/shared-common';

export default function CalendarEntry({
  calendarEntry,
  style,
  className,
}: {
  calendarEntry: CalendarEntryType;
  style?: Record<string, unknown>;
  className?: string;
}) {
  const hasAbsoluteClassName = className?.includes('absolute');
  const finalStyle = style
    ? {
        ...style,
        height: `${
          parseInt(style.height as string, 10) - CALENDAR_WEEKLY_ENTRY_BOTTOM_TOLERANCE_PX
        }px`, // We don't want to overlap with the next entry
      }
    : undefined;
  const borderColor = '#cccccc'; // TODO: either per calendar entry or per calendar
  const backgroundColor = '#ffffff';
  const color = '#000000';

  return (
    <div
      key={calendarEntry.id}
      className={clsx('px-[2px]', !hasAbsoluteClassName && 'relative', className)}
      style={finalStyle}
      data-test="calendar--weekly-view--day--calendar-entry"
      title={calendarEntry.title}
    >
      <div
        className="h-full cursor-pointer rounded-lg border border-transparent px-2 py-1 text-xs transition-all"
        data-test="calendar--weekly-view--day--calendar-entry--content"
        style={{
          borderColor,
          backgroundColor,
          color,
        }}
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

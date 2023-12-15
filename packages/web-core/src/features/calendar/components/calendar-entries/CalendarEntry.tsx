import { clsx } from 'clsx';

import { CalendarEntry } from '@moaitime/shared-common';

export default function CalendarEntry({
  calendarEntry,
  style,
  className,
}: {
  calendarEntry: CalendarEntry;
  style?: Record<string, unknown>;
  className?: string;
}) {
  const hasAbsoluteClassName = className?.includes('absolute');

  const backgroundColor = '#3b82f6'; // TODO: either per calendar entry or per calendar

  return (
    <div
      key={calendarEntry.id}
      className={clsx('px-[2px]', !hasAbsoluteClassName && 'relative', className)}
      style={style}
      data-test="calendar--weekly-view--day--calendar-entry"
      title={calendarEntry.title}
    >
      <div
        className="h-full cursor-pointer rounded-lg border border-transparent px-2 py-1 text-xs text-white transition-all hover:bg-blue-400"
        data-test="calendar--weekly-view--day--calendar-entry--content"
        style={{
          backgroundColor,
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

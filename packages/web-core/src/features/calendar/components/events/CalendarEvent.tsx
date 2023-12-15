import { clsx } from 'clsx';

import { Event } from '@moaitime/shared-common';

export default function CalendarEvent({
  event,
  style,
  className,
}: {
  event: Event;
  style?: Record<string, unknown>;
  className?: string;
}) {
  const hasAbsoluteClassName = className?.includes('absolute');

  const backgroundColor = '#3b82f6'; // TODO: either per event or per calendar

  return (
    <div
      key={event.id}
      className={clsx('px-[2px]', !hasAbsoluteClassName && 'relative', className)}
      style={style}
      data-test="calendar--weekly-view--day--event"
      data-event-id={event.id}
      data-event-title={event.title}
      title={event.title}
    >
      <div
        className="h-full cursor-pointer rounded-lg border border-transparent px-2 py-1 text-xs text-white transition-all hover:bg-blue-400"
        data-test="calendar--weekly-view--day--event--content"
        style={{
          backgroundColor,
        }}
      >
        <h4
          className="overflow-auto break-words font-bold"
          data-test="calendar--weekly-view--day--event--title"
        >
          {event.title}
        </h4>
      </div>
    </div>
  );
}

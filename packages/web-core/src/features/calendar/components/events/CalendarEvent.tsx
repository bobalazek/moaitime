import { EventInterface } from '@moaitime/shared-common';
import { clsx } from 'clsx';

export default function CalendarEvent({
  event,
  style,
  className,
}: {
  event: EventInterface;
  style?: Record<string, unknown>;
  className?: string;
}) {
  const hasAbsoluteClassName = className?.includes('absolute');

  return (
    <div
      key={event.id}
      className={clsx('px-[2px]', !hasAbsoluteClassName && 'relative', className)}
      style={style}
      data-test="calendar--weekly-view--day--event"
      data-event-id={event.id}
      data-event-title={event.title}
    >
      <div
        className="h-full cursor-pointer rounded-lg border border-blue-300 bg-blue-500 px-2 py-1 text-xs text-white transition-all hover:bg-blue-400"
        data-test="calendar--weekly-view--day--event--content"
      >
        <h4 className="font-bold " data-test="calendar--weekly-view--day--event--title">
          {event.title}
        </h4>
      </div>
    </div>
  );
}

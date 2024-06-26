import { differenceInDays, format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useAtomValue } from 'jotai';

import {
  Calendar,
  CalendarEntry,
  CalendarEntryTypeEnum,
  Event,
  List,
  Task,
} from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../../auth/state/authStore';
import { convertTextToHtml } from '../../../../core/utils/TextHelpers';
import { useTasksStore } from '../../../../tasks/state/tasksStore';
import { calendarEventResizingAtom } from '../../../state/calendarAtoms';
import { useEventsStore } from '../../../state/eventsStore';

export type CalendarAgendaViewDayEventEntryProps = {
  calendarEntry: CalendarEntry;
  calendarOrList?: Calendar | List;
};

export default function CalendarAgendaViewDayEventEntry({
  calendarEntry,
  calendarOrList,
}: CalendarAgendaViewDayEventEntryProps) {
  const { setSelectedEventDialogOpen } = useEventsStore();
  const { setSelectedTaskDialogOpen } = useTasksStore();
  const calendarEventResizing = useAtomValue(calendarEventResizingAtom);

  const generalTimezone = useAuthUserSetting('generalTimezone', 'UTC');
  const clockUse24HourClock = useAuthUserSetting('clockUse24HourClock', false);

  const start = utcToZonedTime(calendarEntry.startsAt, generalTimezone);
  const startDate = format(start, 'yyyy-MM-dd');
  const startTime = start.toLocaleString('default', {
    minute: '2-digit',
    hour: '2-digit',
    hour12: !clockUse24HourClock,
  });
  const end = utcToZonedTime(calendarEntry.endsAt, generalTimezone);
  const endDate = format(end, 'yyyy-MM-dd');
  const endTime = end.toLocaleString('default', {
    minute: '2-digit',
    hour: '2-digit',
    hour12: !clockUse24HourClock,
  });
  const endDateReadable = end.toLocaleString('default', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });
  const daysDifference = differenceInDays(new Date(endDate), new Date(startDate));

  const calendarOrListColor = calendarOrList?.color ?? undefined;
  const entryColor = calendarEntry.color ?? calendarOrListColor;

  const onClick = () => {
    if (calendarEventResizing) {
      return;
    }

    if (calendarEntry.type === CalendarEntryTypeEnum.EVENT) {
      setSelectedEventDialogOpen(true, calendarEntry.raw as Event);
    } else if (calendarEntry.type === CalendarEntryTypeEnum.TASK) {
      setSelectedTaskDialogOpen(true, calendarEntry.raw as Task);
    }
  };

  return (
    <div
      key={calendarEntry.id}
      className="bg-background flex cursor-pointer justify-between rounded-lg border-2 p-4"
      onClick={onClick}
      style={{
        borderColor: entryColor,
      }}
    >
      <div>
        <div className="font-bold">{calendarEntry.title}</div>
        {calendarEntry.description && (
          <div
            className="text-muted-foreground mt-1 text-xs"
            dangerouslySetInnerHTML={{
              __html: convertTextToHtml(calendarEntry.description),
            }}
          />
        )}
        {calendarOrList && (
          <div className="mt-2 leading-4">
            <span
              className="mr-1 inline-block h-2 w-2 rounded-full"
              style={{
                backgroundColor: calendarOrListColor,
              }}
            />
            <span className="text-xs">{calendarOrList.name}</span>
          </div>
        )}
      </div>
      <div className="gap-2 text-right text-sm">
        {calendarEntry.isAllDay && (
          <>
            {daysDifference <= 1 && <span>All-Day</span>}
            {daysDifference > 1 && <span>{daysDifference} Full-Days</span>}
          </>
        )}
        {!calendarEntry.isAllDay && (
          <>
            <div>{startTime}</div>
            <div>
              {startDate !== endDate ? `${endDateReadable} ` : ''}
              {endTime}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

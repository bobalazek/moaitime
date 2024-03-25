import { AnimatePresence, motion } from 'framer-motion';

import { CalendarEntry } from '@moaitime/shared-common';

import { useListsStore } from '../../../../tasks/state/listsStore';
import { useCalendarStore } from '../../../state/calendarStore';
import CalendarAgendaViewDayEventEntry from './CalendarAgendaViewDayEventEntry';

export type CalendarAgendaViewDayProps = {
  date: string;
  calendarEntries: CalendarEntry[];
};

const animationVariants = {
  initial: {
    opacity: 0,
    y: 100,
  },
  animate: {
    opacity: 1,
    y: 0,
  },
  exit: {
    opacity: 0,
    y: -100,
  },
};

export default function CalendarAgendaViewDay({
  date,
  calendarEntries,
}: CalendarAgendaViewDayProps) {
  const { calendars } = useCalendarStore();
  const { lists } = useListsStore();

  const dateReadable = new Date(date).toLocaleString('default', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
  const calendarsMap = new Map(calendars.map((calendar) => [calendar.id, calendar]));
  const listsMap = new Map(lists.map((list) => [list.id, list]));

  return (
    <div className="flex flex-col">
      <div className="mb-2 text-lg font-bold">{dateReadable}</div>
      <div className="mb-4 flex flex-col gap-4">
        <AnimatePresence>
          {calendarEntries.map((calendarEntry) => {
            const calendar =
              calendarEntry.raw && 'calendarId' in calendarEntry.raw
                ? calendarsMap.get(calendarEntry.raw?.calendarId)
                : undefined;
            const list =
              calendarEntry.raw && 'listId' in calendarEntry.raw && calendarEntry.raw?.listId
                ? listsMap.get(calendarEntry.raw?.listId)
                : undefined;

            return (
              <motion.div
                key={calendarEntry.id}
                layout
                initial="initial"
                animate="animate"
                exit="exit"
                variants={animationVariants}
              >
                <CalendarAgendaViewDayEventEntry
                  calendarEntry={calendarEntry}
                  calendarOrList={calendar || list}
                />
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </div>
  );
}

import { useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  ScrollArea,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';
import CalendarItem from '../calendar-item/CalendarItem';

export default function PublicCalendarsDialog() {
  const {
    publicCalendars,
    publicCalendarsDialogOpen,
    setPublicCalendarsDialogOpen,
    userCalendars,
  } = useCalendarStore();
  const [search, setSearch] = useState('');

  const userCalendarsMap = new Map(
    userCalendars.map((userCalendar) => [userCalendar.calendar.id, userCalendar])
  );

  const filteredCalendars = search
    ? publicCalendars.filter((calendar) => {
        const lowercaseSearch = search.toLowerCase();

        const lowercaseCalendarName = calendar.name.toLowerCase();
        const lowercaseCalendarDescription = calendar.description?.toLowerCase() ?? '';

        return (
          lowercaseCalendarName.includes(lowercaseSearch) ||
          lowercaseCalendarDescription.includes(lowercaseSearch)
        );
      })
    : publicCalendars;

  return (
    <Dialog open={publicCalendarsDialogOpen} onOpenChange={setPublicCalendarsDialogOpen}>
      <DialogContent data-test="calendar--public-calendars-dialog">
        <DialogHeader>
          <DialogTitle>Public Calendars</DialogTitle>
        </DialogHeader>
        {publicCalendars.length === 0 && (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-muted-foreground text-center">No public calendars</div>
          </div>
        )}
        {publicCalendars.length > 0 && (
          <>
            <Input
              placeholder="Search calendars"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <ScrollArea className="max-h-[calc(100vh-24rem)]">
              {filteredCalendars.map((calendar) => {
                const userCalendar = userCalendarsMap.get(calendar.id);

                return (
                  <CalendarItem
                    key={calendar.id}
                    calendar={calendar}
                    userCalendar={userCalendar}
                    showUserCalendarActions
                    hideCheckbox
                  />
                );
              })}
            </ScrollArea>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

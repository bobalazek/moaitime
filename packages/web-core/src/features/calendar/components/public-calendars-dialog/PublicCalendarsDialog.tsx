import { Dialog, DialogContent, DialogHeader, DialogTitle, ScrollArea } from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';
import CalendarItem from '../common/CalendarItem';

export default function PublicCalendarsDialog() {
  const {
    publicCalendars,
    publicCalendarsDialogOpen,
    setPublicCalendarsDialogOpen,
    userCalendars,
  } = useCalendarStore();

  const userCalendarsMap = new Map(
    userCalendars.map((userCalendar) => [userCalendar.calendar.id, userCalendar])
  );

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
          <ScrollArea className="h-[360px]">
            {publicCalendars.map((calendar) => {
              const userCalendar = userCalendarsMap.get(calendar.id);

              return (
                <CalendarItem
                  key={calendar.id}
                  calendar={calendar}
                  userCalendar={userCalendar}
                  showAddUserCalendar
                  hideCheckbox
                />
              );
            })}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

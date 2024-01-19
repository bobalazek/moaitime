import { Dialog, DialogContent, DialogHeader, DialogTitle, ScrollArea } from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';
import CalendarItem from '../calendar-item/CalendarItem';

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
          <ScrollArea className="max-h-[calc(100vh-12rem)]">
            {publicCalendars.map((calendar) => {
              const userCalendar = userCalendarsMap.get(calendar.id);

              return (
                <CalendarItem
                  key={calendar.id}
                  calendar={calendar}
                  userCalendar={userCalendar}
                  showUserCalendarActions
                  showSharedText
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

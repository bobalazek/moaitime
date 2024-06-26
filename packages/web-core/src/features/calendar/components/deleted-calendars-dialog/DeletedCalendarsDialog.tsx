import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';
import CalendarItem from '../calendar-item/CalendarItem';

export default function DeletedCalendarsDialog() {
  const { deletedCalendars, deletedCalendarsDialogOpen, setDeletedCalendarsDialogOpen } =
    useCalendarStore();

  return (
    <Dialog open={deletedCalendarsDialogOpen} onOpenChange={setDeletedCalendarsDialogOpen}>
      <DialogContent data-test="calendar--deleted-calendars-dialog">
        <DialogHeader>
          <DialogTitle>Deleted Calendars</DialogTitle>
        </DialogHeader>
        {deletedCalendars.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-muted-foreground text-center">No deleted calendars</div>
          </div>
        )}
        {deletedCalendars.length > 0 && (
          <div>
            {deletedCalendars.map((calendar) => (
              <CalendarItem key={calendar.id} calendar={calendar} hideCheckbox />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

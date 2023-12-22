import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';
import CalendarItem from '../common/CalendarItem';

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
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-center">
              <div className="text-xl">No deleted calendars</div>
            </div>
          </div>
        )}
        {deletedCalendars.map((calendar) => (
          <CalendarItem key={calendar.id} calendar={calendar} hideCheckbox />
        ))}
      </DialogContent>
    </Dialog>
  );
}

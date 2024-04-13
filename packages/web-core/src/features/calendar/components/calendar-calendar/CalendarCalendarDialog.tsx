import { useAtom } from 'jotai';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@moaitime/web-ui';

import { calendarCalendarDialogOpenAtom } from '../../state/calendarAtoms';
import CalendarPageHeaderViewSelector from '../pages/calendar/CalendarPageHeaderViewSelector';
import CalendarCalendar from './CalendarCalendar';

function CalendarCalendarDialog() {
  const [calendarCalendarDialogOpen, setCalendarCalendarDialogOpen] = useAtom(
    calendarCalendarDialogOpenAtom
  );

  return (
    <Dialog open={calendarCalendarDialogOpen} onOpenChange={setCalendarCalendarDialogOpen}>
      <DialogContent
        onOpenAutoFocus={(event) => {
          event.preventDefault();
        }}
        data-test="calendar--calendar-dialog"
      >
        <DialogHeader>
          <DialogTitle>Calendar</DialogTitle>
        </DialogHeader>
        <div className="m-auto text-center">
          <CalendarCalendar />
          <hr className="my-2" />
          <h3 className="mb-2 font-bold">View</h3>
          <CalendarPageHeaderViewSelector />
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default CalendarCalendarDialog;

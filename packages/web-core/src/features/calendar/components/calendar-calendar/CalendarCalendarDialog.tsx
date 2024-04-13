import { useAtom } from 'jotai';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@moaitime/web-ui';

import { calendarCalendarDialogOpenAtom } from '../../state/calendarAtoms';
import CalendarCalendar from './CalendarCalendar';

function CalendarCalendarDialog() {
  const [calendarCalendarDialogOpen, setCalendarCalendarDialogOpen] = useAtom(
    calendarCalendarDialogOpenAtom
  );

  return (
    <Dialog open={calendarCalendarDialogOpen} onOpenChange={setCalendarCalendarDialogOpen}>
      <DialogContent data-test="calendar--calendar-dialog">
        <DialogHeader>
          <DialogTitle>Calendar</DialogTitle>
        </DialogHeader>
        <div className="m-auto">
          <CalendarCalendar />
        </div>{' '}
      </DialogContent>
    </Dialog>
  );
}

export default CalendarCalendarDialog;

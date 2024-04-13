import { useAtom } from 'jotai';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@moaitime/web-ui';

import { habitsCalendarDialogOpenAtom } from '../../state/habitsAtoms';
import HabitsCalendar from './HabitsCalendar';

function HabitsCalendarDialog() {
  const [habitsCalendarDialogOpen, setHabitsCalendarDialogOpen] = useAtom(
    habitsCalendarDialogOpenAtom
  );

  return (
    <Dialog open={habitsCalendarDialogOpen} onOpenChange={setHabitsCalendarDialogOpen}>
      <DialogContent data-test="habits--header--calendar-dialog">
        <DialogHeader>
          <DialogTitle>Calendar</DialogTitle>
        </DialogHeader>
        <div className="m-auto">
          <HabitsCalendar />
        </div>{' '}
      </DialogContent>
    </Dialog>
  );
}

export default HabitsCalendarDialog;

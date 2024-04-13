import { useSetAtom } from 'jotai';

import { Calendar } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import {
  habitsCalendarDialogOpenAtom,
  habitsCalendarPopoverOpenAtom,
} from '../../state/habitsAtoms';
import { useHabitsStore } from '../../state/habitsStore';

function HabitsCalendar() {
  const { selectedDate, setSelectedDate } = useHabitsStore();
  const setHabitsCalendarPopoverOpen = useSetAtom(habitsCalendarPopoverOpenAtom);
  const setHabitsCalendarDialogOpen = useSetAtom(habitsCalendarDialogOpenAtom);

  const generalStartDayOfWeek = useAuthUserSetting('generalStartDayOfWeek', 0);
  const now = new Date();

  return (
    <Calendar
      captionLayout="dropdown-buttons"
      mode="single"
      fromYear={now.getFullYear() - 30}
      toYear={now.getFullYear() + 5}
      selected={selectedDate}
      weekStartsOn={generalStartDayOfWeek}
      onSelect={(value) => {
        setSelectedDate(value ?? selectedDate);

        setHabitsCalendarPopoverOpen(false);
        setHabitsCalendarDialogOpen(false);
      }}
      modifiersStyles={{
        selectedDays: {
          border: '1px solid #eee',
        },
      }}
    />
  );
}

export default HabitsCalendar;

import { useSetAtom } from 'jotai';

import { Calendar } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import {
  calendarCalendarDialogOpenAtom,
  calendarCalendarPopoverOpenAtom,
} from '../../state/calendarAtoms';
import { useCalendarStore } from '../../state/calendarStore';

// No, this is not a type - the first calendar shows that we are in the calendar feature,
// and the second calendar shows the actual component name.

function CalendarCalendar() {
  const { selectedDays, selectedDate, setSelectedDate } = useCalendarStore();
  const setCalendarCalendarPopoverOpen = useSetAtom(calendarCalendarPopoverOpenAtom);
  const setCalendarCalendarDialogOpen = useSetAtom(calendarCalendarDialogOpenAtom);

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

        setCalendarCalendarPopoverOpen(false);
        setCalendarCalendarDialogOpen(false);
      }}
      modifiers={{
        selectedDays,
      }}
      modifiersStyles={{
        selectedDays: {
          border: '1px solid #eee',
        },
      }}
    />
  );
}

export default CalendarCalendar;

import { FaCalendarAlt } from 'react-icons/fa';

import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useCalendarStore } from '../../state/calendarStore';

function CalendarDialogHeaderCalendar() {
  const { auth } = useAuthStore();
  const { selectedDays, selectedDate, setSelectedDate } = useCalendarStore();

  const generalStartDayOfWeek = auth?.user?.settings?.generalStartDayOfWeek ?? 0;
  const now = new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          data-test="calendar--dialog--header--calendar-button"
        >
          <FaCalendarAlt />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          captionLayout="dropdown-buttons"
          mode="single"
          fromYear={now.getFullYear() - 30}
          toYear={now.getFullYear() + 5}
          selected={selectedDate}
          weekStartsOn={generalStartDayOfWeek}
          onSelect={(value) => {
            setSelectedDate(value ?? selectedDate);
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
      </PopoverContent>
    </Popover>
  );
}

export default CalendarDialogHeaderCalendar;

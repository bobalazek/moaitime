import { CalendarIcon } from 'lucide-react';

import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../../auth/state/authStore';
import { useCalendarStore } from '../../../state/calendarStore';

function CalendarPageHeaderCalendar() {
  const { selectedDays, selectedDate, setSelectedDate } = useCalendarStore();

  const generalStartDayOfWeek = useAuthUserSetting('generalStartDayOfWeek', 0);
  const now = new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          title="Open calendar selector"
          data-test="calendar--header--calendar--trigger-button"
        >
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" data-test="calendar--header--calendar">
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

export default CalendarPageHeaderCalendar;

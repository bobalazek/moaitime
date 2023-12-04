import { FaCalendarAlt } from 'react-icons/fa';

import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@myzenbuddy/web-ui';

import { useSettingsStore } from '../../../settings/state/settingsStore';
import { useCalendarStore } from '../../state/calendarStore';

function CalendarDialogHeaderCalendar() {
  const {
    settings: { calendarStartDayOfWeek },
  } = useSettingsStore();
  const { selectedDays, selectedDate, setSelectedDate } = useCalendarStore();

  const now = new Date();

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="border" variant="ghost" size="sm" data-test="calendar--dialog--header--calendar-button">
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
          weekStartsOn={calendarStartDayOfWeek}
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

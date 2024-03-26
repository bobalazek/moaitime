import { CalendarIcon } from 'lucide-react';

import { Button, Calendar, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../../auth/state/authStore';
import { useHabitsStore } from '../../../state/habitsStore';

function HabitsPageHeaderCalendar() {
  const { selectedDate, setSelectedDate } = useHabitsStore();

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
          data-test="habits--header--calendar--trigger-button"
        >
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end" data-test="habits--header--calendar">
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

export default HabitsPageHeaderCalendar;

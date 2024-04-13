import { useAtom } from 'jotai';
import { CalendarIcon } from 'lucide-react';

import { Button, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { calendarCalendarPopoverOpenAtom } from '../../state/calendarAtoms';
import CalendarCalendar from './CalendarCalendar';

// No, this is not a type - the first calendar shows that we are in the calendar feature,
// and the second calendar shows the actual component name.

function CalendarCalendarPopover() {
  const [calendarCalendarPopoverOpen, setCalendarCalendarPopoverOpen] = useAtom(
    calendarCalendarPopoverOpenAtom
  );

  return (
    <Popover open={calendarCalendarPopoverOpen} onOpenChange={setCalendarCalendarPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          title="Open calendar selector"
          data-test="calendar--calendar--trigger-button"
        >
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end" data-test="calendar--calendar">
        <CalendarCalendar />
      </PopoverContent>
    </Popover>
  );
}

export default CalendarCalendarPopover;

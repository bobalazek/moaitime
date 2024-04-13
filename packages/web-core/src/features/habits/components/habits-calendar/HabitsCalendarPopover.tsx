import { useAtom } from 'jotai';
import { CalendarIcon } from 'lucide-react';

import { Button, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { habitsCalendarPopoverOpenAtom } from '../../state/habitsAtoms';
import HabitsCalendar from './HabitsCalendar';

function HabitsCalendarPopover() {
  const [habitsCalendarPopoverOpen, setHabitsCalendarPopoverOpen] = useAtom(
    habitsCalendarPopoverOpenAtom
  );

  return (
    <Popover open={habitsCalendarPopoverOpen} onOpenChange={setHabitsCalendarPopoverOpen}>
      <PopoverTrigger asChild>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          title="Open calendar selector"
          data-test="habits--header--calendar-popover--trigger-button"
        >
          <CalendarIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-0" align="end" data-test="habits--header--calendar-popover">
        <HabitsCalendar />
      </PopoverContent>
    </Popover>
  );
}

export default HabitsCalendarPopover;

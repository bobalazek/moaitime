import { FaCog, FaPlus } from 'react-icons/fa';

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@moaitime/web-ui';

import { useCalendarStore } from '../../state/calendarStore';
import CalendarSettingsSheetCalendar from './CalendarSettingsSheetCalendar';

export default function CalendarSettingsSheet() {
  const { calendars, setSelectedCalendarDialogOpen } = useCalendarStore();

  const onNewCalendarButtonClick = () => {
    setSelectedCalendarDialogOpen(true, null);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          data-test="calendar--dialog--header--settings-button"
        >
          <FaCog />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Here we will have the main calendar settings.</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold">My Calendars</h3>
            <button
              type="button"
              className="cursor-pointer rounded-full"
              data-test="calendar--settings-sheet--my-calendars--add-new-button"
              onClick={onNewCalendarButtonClick}
            >
              <FaPlus className="h-4 w-4" />
            </button>
          </div>
          {calendars.map((calendar) => (
            <CalendarSettingsSheetCalendar key={calendar.id} calendar={calendar} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

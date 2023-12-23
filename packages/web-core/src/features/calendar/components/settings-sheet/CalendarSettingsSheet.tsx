import { FaCog } from 'react-icons/fa';

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
import CalendarItem from '../common/CalendarItem';
import CalendarSettingsSheetMyCalendarsActions from './CalendarSettingsSheetMyCalendarsActions';

export default function CalendarSettingsSheet() {
  const { settingsSheetOpen, setSettingsSheetOpen, calendars } = useCalendarStore();

  return (
    <Sheet open={settingsSheetOpen} onOpenChange={setSettingsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          data-test="calendar--header--settings-button"
        >
          <FaCog />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="sm:w-max-[420px] w-full"
        data-test="calendar--settings-sheet"
      >
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>Here we will have the main calendar settings.</SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold">My Calendars</h3>
            <CalendarSettingsSheetMyCalendarsActions />
          </div>
          {calendars.map((calendar) => (
            <CalendarItem key={calendar.id} calendar={calendar} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

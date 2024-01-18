import { CogIcon } from 'lucide-react';

import {
  Button,
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@moaitime/web-ui';

import { useListsStore } from '../../../tasks/state/listsStore';
import { useCalendarStore } from '../../state/calendarStore';
import CalendarItem from '../common/CalendarItem';
import ListItem from '../common/ListItem';
import CalendarSettingsSheetMyCalendarsActions from './CalendarSettingsSheetMyCalendarsActions';
import CalendarSettingsSheetUserCalendarsActions from './CalendarSettingsSheetUserCalendarsActions';

export default function CalendarSettingsSheet() {
  const { settingsSheetOpen, setSettingsSheetOpen, calendars, userCalendars } = useCalendarStore();
  const { lists } = useListsStore();

  return (
    <Sheet open={settingsSheetOpen} onOpenChange={setSettingsSheetOpen}>
      <SheetTrigger asChild>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          title="Open calendar settings"
          data-test="calendar--header--settings-button"
        >
          <CogIcon />
        </Button>
      </SheetTrigger>
      <SheetContent
        side="right"
        className="sm:w-max-[420px] w-full"
        data-test="calendar--settings-sheet"
      >
        <SheetHeader>
          <SheetTitle>Settings</SheetTitle>
          <SheetDescription>
            Here you are able to specify the which events and tasks you want to see.
          </SheetDescription>
        </SheetHeader>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold">My Calendars</h3>
            <CalendarSettingsSheetMyCalendarsActions />
          </div>
          {calendars.length === 0 && (
            <p className="text-xs text-gray-500">You do not have any calendars at the moment.</p>
          )}
          {calendars.map((calendar) => (
            <CalendarItem key={calendar.id} calendar={calendar} />
          ))}
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold">Shared Calendars</h3>
            <CalendarSettingsSheetUserCalendarsActions />
          </div>
          {userCalendars.length === 0 && (
            <p className="text-xs text-gray-500">
              You do not have any shared calendars at the moment.
            </p>
          )}
          {userCalendars.map((userCalendar) => (
            <CalendarItem
              key={userCalendar.id}
              calendar={userCalendar.calendar}
              userCalendar={userCalendar}
              showAddUserCalendar
            />
          ))}
        </div>
        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="font-bold">My Lists</h3>
          </div>
          {lists.length === 0 && (
            <p className="text-xs text-gray-500">You do not have any lists at the moment.</p>
          )}
          {lists.map((list) => (
            <ListItem key={list.id} list={list} />
          ))}
        </div>
      </SheetContent>
    </Sheet>
  );
}

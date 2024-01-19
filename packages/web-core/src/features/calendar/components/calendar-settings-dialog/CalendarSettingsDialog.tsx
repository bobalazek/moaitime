import { CogIcon } from 'lucide-react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@moaitime/web-ui';

import { useListsStore } from '../../../tasks/state/listsStore';
import { useCalendarStore } from '../../state/calendarStore';
import CalendarItem from '../calendar-item/CalendarItem';
import ListItem from '../list-item/ListItem';
import CalendarSettingsDialogMyCalendarsActions from './CalendarSettingsDialogMyCalendarsActions';
import CalendarSettingsDialogUserCalendarsActions from './CalendarSettingsDialogUserCalendarsActions';

export default function CalendarSettingsDialog() {
  const { settingsDialogOpen, setSettingsDialogOpen, calendars, userCalendars } =
    useCalendarStore();
  const { lists } = useListsStore();

  return (
    <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          title="Open calendar settings"
          data-test="calendar--header--open-settings-button"
        >
          <CogIcon />
        </Button>
      </DialogTrigger>
      <DialogContent data-test="calendar--settings-dialog">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Here you are able to specify the which events and tasks you want to see.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-12rem)]">
          <div>
            <div className="flex items-center gap-1">
              <h3 className="font-bold">My Calendars</h3>
              <CalendarSettingsDialogMyCalendarsActions />
            </div>
            {calendars.length === 0 && (
              <p className="text-xs text-gray-500">You do not have any calendars at the moment.</p>
            )}
            {calendars.map((calendar) => (
              <CalendarItem key={calendar.id} calendar={calendar} />
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center gap-1">
              <h3 className="font-bold">Shared Calendars</h3>
              <CalendarSettingsDialogUserCalendarsActions />
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
                showUserCalendarActions
              />
            ))}
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold">My Lists</h3>
            </div>
            {lists.length === 0 && (
              <p className="text-xs text-gray-500">You do not have any lists at the moment.</p>
            )}
            {lists.map((list) => (
              <ListItem key={list.id} list={list} />
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

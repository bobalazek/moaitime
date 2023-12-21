import { Calendar } from '@moaitime/shared-common';
import { Checkbox } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useCalendarStore } from '../../state/calendarStore';
import CalendarSettingsSheetCalendarActions from './CalendarSettingsSheetCalendarActions';

export interface CalendarSettingsSheetCalendarProps {
  calendar: Calendar;
}

export default function CalendarSettingsSheetCalendar({
  calendar,
}: CalendarSettingsSheetCalendarProps) {
  const { auth } = useAuthStore();
  const { addVisibleCalendar, removeVisibleCalendar } = useCalendarStore();

  const visibleCalendarIds = auth?.user?.settings?.calendarVisibleCalendarIds || [];

  const isChecked = visibleCalendarIds.includes('*') || visibleCalendarIds.includes(calendar.id);

  const onCheckedChange = async () => {
    if (isChecked) {
      await removeVisibleCalendar(calendar.id);

      return;
    }

    await addVisibleCalendar(calendar.id);
  };

  return (
    <div
      className="min-h-[2rem] rounded-lg p-1 outline-none hover:bg-gray-50 dark:hover:bg-gray-800"
      data-test="calendar--settings-sheet--calendar"
    >
      <div className="relative h-full w-full">
        <Checkbox
          className="absolute left-0 top-1"
          checked={isChecked}
          onCheckedChange={onCheckedChange}
          style={{
            backgroundColor: calendar.color ?? '',
          }}
          data-test="calendar--settings-sheet--calendar--visible-checkbox"
        />
        <div className="break-words px-6" data-test="calendar--settings-sheet--calendar--name">
          {calendar.name}
        </div>
        <CalendarSettingsSheetCalendarActions calendar={calendar} />
      </div>
    </div>
  );
}

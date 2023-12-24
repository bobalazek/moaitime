import { Calendar } from '@moaitime/shared-common';
import { Checkbox } from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useCalendarStore } from '../../state/calendarStore';
import CalendarItemActions from './CalendarIemActions';

export interface CalendarSettingsSheetCalendarProps {
  calendar: Calendar;
  hideCheckbox?: boolean;
}

export default function CalendarItem({
  calendar,
  hideCheckbox,
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
      data-test="calendar--calendar-item"
      data-calendar-id={calendar.id}
    >
      <div className="relative h-full w-full">
        {!hideCheckbox && (
          <Checkbox
            className="absolute left-0 top-1"
            checked={isChecked}
            onCheckedChange={onCheckedChange}
            style={{
              backgroundColor: calendar.color ?? '',
            }}
            data-test="calendar--calendar-item--visible-checkbox"
          />
        )}
        <div className="break-words px-6" data-test="calendar--settings-sheet--calendar--name">
          {calendar.name}
        </div>
        <CalendarItemActions calendar={calendar} />
      </div>
    </div>
  );
}

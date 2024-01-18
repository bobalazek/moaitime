import { colord } from 'colord';

import { Calendar } from '@moaitime/shared-common';
import { Checkbox } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { useCalendarStore } from '../../state/calendarStore';
import CalendarItemActions from './CalendarItemActions';

export interface CalendarSettingsSheetCalendarItemProps {
  calendar: Calendar;
  hideCheckbox?: boolean;
  showSharedText?: boolean;
}

export default function CalendarItem({
  calendar,
  hideCheckbox,
  showSharedText,
}: CalendarSettingsSheetCalendarItemProps) {
  const { addVisibleCalendar, removeVisibleCalendar, sharedCalendars } = useCalendarStore();

  const visibleCalendarIds = useAuthUserSetting('calendarVisibleCalendarIds', [] as string[]);

  const isChecked = visibleCalendarIds.includes('*') || visibleCalendarIds.includes(calendar.id);

  const onCheckedChange = async () => {
    if (isChecked) {
      await removeVisibleCalendar(calendar.id);

      return;
    }

    await addVisibleCalendar(calendar.id);
  };

  const isShared = sharedCalendars.some((sharedCalendar) => sharedCalendar.id === calendar.id);
  const checkboxBackgroundColor = calendar.color ?? '';
  const checkboxColor = checkboxBackgroundColor
    ? colord(checkboxBackgroundColor).isDark()
      ? 'white'
      : 'black'
    : '';

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
              backgroundColor: checkboxBackgroundColor,
              color: checkboxColor,
            }}
            data-test="calendar--calendar-item--visible-checkbox"
          />
        )}
        <div className="break-words px-6" data-test="calendar--settings-sheet--calendar--name">
          <span>{calendar.name}</span>
          {showSharedText && isShared && (
            <span className="text-muted-foreground text-xs"> (shared)</span>
          )}
        </div>
        <CalendarItemActions calendar={calendar} />
      </div>
    </div>
  );
}

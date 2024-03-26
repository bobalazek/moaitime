import { UsersIcon } from 'lucide-react';

import { Calendar, UserCalendar } from '@moaitime/shared-common';
import { Checkbox } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../../auth/state/authStore';
import { getTextColor } from '../../../core/utils/ColorHelpers';
import { useCalendarStore } from '../../state/calendarStore';
import CalendarItemActions from './CalendarItemActions';

export interface CalendarItemProps {
  calendar: Calendar;
  userCalendar?: UserCalendar;
  hideCheckbox?: boolean;
  showUserCalendarActions?: boolean;
}

export default function CalendarItem({
  calendar,
  userCalendar,
  hideCheckbox,
  showUserCalendarActions,
}: CalendarItemProps) {
  const { addVisibleCalendar, removeVisibleCalendar } = useCalendarStore();

  const visibleCalendarIds = useAuthUserSetting('calendarVisibleCalendarIds', [] as string[]);

  const isChecked = visibleCalendarIds.includes('*') || visibleCalendarIds.includes(calendar.id);

  const onCheckedChange = async () => {
    if (isChecked) {
      await removeVisibleCalendar(calendar.id);

      return;
    }

    await addVisibleCalendar(calendar.id);
  };

  const backgroundColor = userCalendar?.color ?? calendar.color ?? '';
  const color = getTextColor(backgroundColor);

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
              backgroundColor,
              color,
            }}
            data-test="calendar--calendar-item--visible-checkbox"
          />
        )}
        <div className="break-words px-6">
          <span data-test="calendar--settings-dialog--calendar--name">{calendar.name}</span>
          {calendar?.teamId && (
            <span className="ml-1">
              {' '}
              <UsersIcon className="inline text-gray-400" size={16} />
            </span>
          )}
        </div>
        <CalendarItemActions
          calendar={calendar}
          userCalendar={userCalendar}
          showUserCalendarActions={showUserCalendarActions}
        />
      </div>
      {calendar.description && (
        <div
          className="text-muted-foreground mt-1 px-6 text-xs"
          data-test="calendar--settings-dialog--calendar--description"
        >
          {calendar.description}
        </div>
      )}
    </div>
  );
}

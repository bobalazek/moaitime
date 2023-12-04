import { endOfWeek, getWeek, isSameMonth, startOfWeek } from 'date-fns';

import { CalendarViewEnum } from '@myzenbuddy/shared-common';

import { useSettingsStore } from '../../../settings/state/settingsStore';
import { useCalendarStore } from '../../state/calendarStore';

function CalendarDialogHeaderText() {
  const { selectedDate, selectedView } = useCalendarStore();
  const {
    settings: { calendarStartDayOfWeek },
  } = useSettingsStore();

  const year = selectedDate.getFullYear();
  const date = selectedDate.toLocaleString('default', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  let text = <span>{date}</span>;

  if (selectedView === CalendarViewEnum.DAY) {
    const day = selectedDate.toLocaleDateString('default', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    text = <span>{day}</span>;
  } else if (selectedView === CalendarViewEnum.WEEK) {
    const week = getWeek(selectedDate);
    const startDayOfWeek = startOfWeek(selectedDate, { weekStartsOn: calendarStartDayOfWeek });
    const endDayOfWeek = endOfWeek(selectedDate, { weekStartsOn: calendarStartDayOfWeek });
    const startDate = startDayOfWeek.toLocaleString('default', {
      month: !isSameMonth(startDayOfWeek, endDayOfWeek) ? 'long' : undefined,
      day: 'numeric',
    });
    const endDate = endDayOfWeek.toLocaleString('default', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });

    text = (
      <span>
        {startDate} to {endDate} <small className="text-sm">(week {week})</small>
      </span>
    );
  } else if (selectedView === CalendarViewEnum.MONTH) {
    const month = selectedDate.toLocaleString('default', { month: 'long' });

    text = (
      <span>
        {month} {year}
      </span>
    );
  } else if (selectedView === CalendarViewEnum.YEAR) {
    text = <span>{year}</span>;
  }

  return <span data-test="calendar--dialog--header--text">{text}</span>;
}

export default CalendarDialogHeaderText;

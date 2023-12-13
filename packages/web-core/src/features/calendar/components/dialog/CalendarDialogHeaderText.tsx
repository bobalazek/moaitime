import { endOfWeek, getWeek, isSameMonth, startOfWeek } from 'date-fns';

import { CalendarViewEnum } from '@moaitime/shared-common';

import { useAuthStore } from '../../../auth/state/authStore';
import { useCalendarStore } from '../../state/calendarStore';

function CalendarDialogHeaderText() {
  const { auth } = useAuthStore();
  const { selectedDate, selectedView } = useCalendarStore();

  const generalStartDayOfWeek = auth?.user?.settings?.generalStartDayOfWeek ?? 0;
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
    const startDayOfWeek = startOfWeek(selectedDate, { weekStartsOn: generalStartDayOfWeek });
    const endDayOfWeek = endOfWeek(selectedDate, { weekStartsOn: generalStartDayOfWeek });
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

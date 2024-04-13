import { endOfWeek, getWeek, isSameMonth, startOfWeek } from 'date-fns';
import { isMobile } from 'react-device-detect';

import { CalendarViewEnum } from '@moaitime/shared-common';

import { useAuthUserSetting } from '../../../../auth/state/authStore';
import { useCalendarStore } from '../../../state/calendarStore';
import { getAgendaRange } from '../../../utils/CalendarHelpers';

function CalendarPageHeaderText() {
  const { selectedDate, selectedView } = useCalendarStore();

  const generalStartDayOfWeek = useAuthUserSetting('generalStartDayOfWeek', 0);
  const year = selectedDate.getFullYear();
  const date = selectedDate.toLocaleString('default', {
    month: isMobile ? 'short' : 'long',
    day: 'numeric',
    year: 'numeric',
  });

  let text = <span>{date}</span>;

  if (selectedView === CalendarViewEnum.DAY) {
    const day = selectedDate.toLocaleDateString(undefined, {
      weekday: isMobile ? 'short' : 'long',
      month: isMobile ? 'short' : 'long',
      day: 'numeric',
      year: 'numeric',
    });

    text = <span>{day}</span>;
  } else if (selectedView === CalendarViewEnum.WEEK) {
    const week = getWeek(selectedDate);
    const startDayOfWeek = startOfWeek(selectedDate, { weekStartsOn: generalStartDayOfWeek });
    const endDayOfWeek = endOfWeek(selectedDate, { weekStartsOn: generalStartDayOfWeek });
    const startDate = startDayOfWeek.toLocaleString('default', {
      month: !isSameMonth(startDayOfWeek, endDayOfWeek) ? (isMobile ? 'short' : 'long') : undefined,
      day: 'numeric',
    });
    const endDate = endDayOfWeek.toLocaleString('default', {
      month: isMobile ? 'short' : 'long',
      day: 'numeric',
      year: 'numeric',
    });

    text = (
      <span>
        {startDate} to {endDate} <small className="text-sm">(week {week})</small>
      </span>
    );
  } else if (selectedView === CalendarViewEnum.MONTH) {
    const month = selectedDate.toLocaleString('default', {
      month: isMobile ? 'short' : 'long',
    });

    text = (
      <span>
        {month} {year}
      </span>
    );
  } else if (selectedView === CalendarViewEnum.YEAR) {
    text = <span>{year}</span>;
  } else if (selectedView === CalendarViewEnum.AGENDA) {
    const agendaRange = getAgendaRange(selectedDate);

    const startDate = agendaRange.start.toLocaleString('default', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
    const endDate = agendaRange.end.toLocaleString('default', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    text = (
      <span>
        {startDate} to {endDate}
      </span>
    );
  }

  return <span data-test="calendar--header--text">{text}</span>;
}

export default CalendarPageHeaderText;

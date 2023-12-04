import { useCalendarStore } from '../../state/calendarStore';
import CalendarWeeklyView from './CalendarWeeklyView';

export default function CalendarDailyView() {
  const { selectedDate } = useCalendarStore();

  return <CalendarWeeklyView singleDay={selectedDate} />;
}

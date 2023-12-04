import { FaCalendarAlt } from 'react-icons/fa';

export default function CalendarSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <FaCalendarAlt />
      <span>Calendar</span>
    </div>
  );
}

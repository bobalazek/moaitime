import { FaClock } from 'react-icons/fa';

export default function ClockSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <FaClock />
      <span>Clock</span>
    </div>
  );
}

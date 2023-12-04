import { FaTasks } from 'react-icons/fa';

export default function TasksSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <FaTasks />
      <span>Tasks</span>
    </div>
  );
}

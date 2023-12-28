import { ListChecksIcon } from 'lucide-react';

export default function TasksSettingsSectionHeaderText() {
  return (
    <div className="flex items-center gap-2">
      <ListChecksIcon />
      <span>Tasks</span>
    </div>
  );
}

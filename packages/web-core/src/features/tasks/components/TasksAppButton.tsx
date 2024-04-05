import { ListChecksIcon } from 'lucide-react';

import { AppButton } from '../../core/components/AppButton';
import { useTasksStore } from '../state/tasksStore';

export default function TasksAppButton() {
  const { setPopoverOpen } = useTasksStore();

  return (
    <AppButton
      icon={ListChecksIcon}
      onClick={() => {
        setPopoverOpen(true);
      }}
      title="Tasks"
      style={{
        backgroundImage: 'linear-gradient(180deg, #4FC3F7 0%, #0288D1 100%)',
      }}
      data-test="tasks--popover--trigger-button"
    />
  );
}

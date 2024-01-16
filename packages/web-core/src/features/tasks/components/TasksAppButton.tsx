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
      data-test="tasks--popover--trigger-button"
    />
  );
}

import { ListChecksIcon } from 'lucide-react';

import { AppButton } from '../../core/components/AppButton';
import { useTasksStore } from '../state/tasksStore';

export default function TasksAppButton() {
  const { setPopoverOpen } = useTasksStore();

  return (
    <AppButton
      icon={ListChecksIcon}
      title="Open tasks"
      data-test="tasks--popover--trigger-button"
      onClick={() => {
        setPopoverOpen(true);
      }}
    />
  );
}

import { useEffect } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../auth/state/authStore';
import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { tasksEmitter, TasksEventsEnum } from '../state/tasksEmitter';
import { useTasksStore } from '../state/tasksStore';
import { playAddTaskSound, playCompleteTaskSound } from '../utils/TaskHelpers';
import TasksBody from './tasks-body/TasksBody';

export default function TasksPopover() {
  const { popoverOpen, setPopoverOpen } = useTasksStore();
  const tasksSoundsEnabled = useAuthUserSetting('tasksSoundsEnabled', false);

  useEffect(() => {
    if (!tasksSoundsEnabled) {
      return;
    }

    const taskAddedCallback = () => {
      playAddTaskSound();
    };

    const taskCompletedCallback = () => {
      playCompleteTaskSound();
    };

    tasksEmitter.on(TasksEventsEnum.TASK_ADDED, taskAddedCallback);
    tasksEmitter.on(TasksEventsEnum.TASK_COMPLETED, taskCompletedCallback);

    return () => {
      tasksEmitter.off(TasksEventsEnum.TASK_ADDED, taskAddedCallback);
      tasksEmitter.off(TasksEventsEnum.TASK_COMPLETED, taskCompletedCallback);
    };
  }, [tasksSoundsEnabled]);

  return (
    <ErrorBoundary>
      <Popover
        open={popoverOpen}
        onOpenChange={setPopoverOpen}
        modal={
          true
          /**
           * This needs to be set to true, otherwise we have issues this popover closing
           * when a dialog gets opened - either for a new list, delete list alert dialog,
           * or editing a task, so this is a workaround for that.
           */
        }
      >
        <PopoverTrigger asChild>
          {/* We need an empty div so it knows where to place that popover */}
          <div className="absolute bottom-0 right-4" />
        </PopoverTrigger>
        <PopoverContent
          className="sm: mb-4 w-full min-w-[320px] md:min-w-[380px]"
          align="end"
          data-test="tasks--popover"
        >
          <TasksBody />
        </PopoverContent>
      </Popover>
    </ErrorBoundary>
  );
}

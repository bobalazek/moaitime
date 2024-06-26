import { useEffect } from 'react';

import { GlobalEventsEnum } from '@moaitime/shared-common';
import { Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../auth/state/authStore';
import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { globalEventsEmitter } from '../../core/state/globalEventsEmitter';
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

    globalEventsEmitter.on(GlobalEventsEnum.TASKS_TASK_ADDED, taskAddedCallback);
    globalEventsEmitter.on(GlobalEventsEnum.TASKS_TASK_COMPLETED, taskCompletedCallback);

    return () => {
      globalEventsEmitter.off(GlobalEventsEnum.TASKS_TASK_ADDED, taskAddedCallback);
      globalEventsEmitter.off(GlobalEventsEnum.TASKS_TASK_COMPLETED, taskCompletedCallback);
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
          <div className="fixed bottom-3 right-3" />
        </PopoverTrigger>
        <PopoverContent className="p-0" id="tasks-popover" align="end" data-test="tasks--popover">
          <div className="w-full min-w-[320px] max-w-[380px] p-0 md:min-w-[380px]">
            <TasksBody />
          </div>
        </PopoverContent>
      </Popover>
    </ErrorBoundary>
  );
}

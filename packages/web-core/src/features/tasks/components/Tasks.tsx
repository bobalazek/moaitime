import { useEffect } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useListsStore } from '../state/listsStore';
import { useTasksStore } from '../state/tasksStore';
import TasksBody from './body/TasksBody';

export default function Tasks() {
  const { popoverOpen, setPopoverOpen } = useTasksStore();
  const { lists, selectedList, setSelectedList } = useListsStore();

  useEffect(() => {
    if (selectedList || lists.length === 0) {
      return;
    }

    // We want to select the first list by default
    setSelectedList(lists[0]);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedList, lists]);

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
          {/* We need this element so the popover know where it should appear. We actually trigger the open outside. We need an empty div so it knows where to place that popover*/}
          <div className="absolute bottom-0 right-4" />
        </PopoverTrigger>
        <PopoverContent className="mb-4 w-full" align="end" data-test="tasks--popover">
          <TasksBody />
        </PopoverContent>
      </Popover>
    </ErrorBoundary>
  );
}

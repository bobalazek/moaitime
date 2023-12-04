import { useEffect } from 'react';
import { FaTasks } from 'react-icons/fa';

import { Popover, PopoverContent, PopoverTrigger } from '@myzenbuddy/web-ui';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useTasksStore } from '../state/tasksStore';
import TasksBody from './body/TasksBody';
import ListDeleteAlertDialog from './lists/ListDeleteAlertDialog';
import ListFormDialog from './lists/ListFormDialog';
import TaskDialog from './tasks/TaskDialog';

export default function Tasks() {
  const { popoverOpen, setPopoverOpen, lists, selectedList, setSelectedList } = useTasksStore();

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
          <button className="text-xl transition-all hover:text-gray-200" data-test="tasks--popover--trigger-button">
            <FaTasks className="text-3xl" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="mb-4 w-full" align="end" data-test="tasks--popover">
          <TasksBody />
        </PopoverContent>
      </Popover>
      <TaskDialog />
      <ListFormDialog />
      <ListDeleteAlertDialog />
    </ErrorBoundary>
  );
}

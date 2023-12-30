import { ListChecksIcon } from 'lucide-react';
import { useEffect } from 'react';

import { Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import { useTasksStore } from '../state/tasksStore';
import TasksBody from './body/TasksBody';
import ListDeleteAlertDialog from './list-delete-alert-dialog/ListDeleteAlertDialog';
import ListEditDialog from './list-edit-dialog/ListEditDialog';
import TaskEditDialog from './task-edit-dialog/TaskEditDialog';

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
          <button
            className="text-xl text-white transition-all"
            title="Open tasks"
            data-test="tasks--popover--trigger-button"
          >
            <ListChecksIcon className="text-3xl" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="mb-4 w-full" align="end" data-test="tasks--popover">
          <TasksBody />
        </PopoverContent>
      </Popover>
      <TaskEditDialog />
      <ListEditDialog />
      <ListDeleteAlertDialog />
    </ErrorBoundary>
  );
}

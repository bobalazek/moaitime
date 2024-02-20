import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';

import { CreateTask, GlobalEventsEnum, Task, UpdateTask } from '@moaitime/shared-common';

import { useCalendarStore } from '../../calendar/state/calendarStore';
import { globalEventsEmitter } from '../../core/state/globalEventsEmitter';
import {
  addTask,
  completeTask,
  deleteTask,
  duplicateTask,
  editTask,
  getTask,
  getTasks,
  reorderTask,
  uncompleteTask,
  undeleteTask,
} from '../utils/TaskHelpers';
import { useListsStore } from './listsStore';

export type TasksStore = {
  /********** General **********/
  popoverOpen: boolean;
  setPopoverOpen: (popoverOpen: boolean) => Promise<void>;
  openPopoverForTask: (taskId: string) => Promise<void>;
  // Tasks List End Element
  listEndElement: HTMLElement | null;
  setListEndElement: (listEndElement: HTMLElement | null) => void;
  /********** Tasks **********/
  getTasksByQuery: (query: string) => Promise<Task[]>;
  getTask: (taskId: string) => Promise<Task | null>;
  addTask: (task: CreateTask) => Promise<Task>;
  editTask: (taskId: string, task: UpdateTask) => Promise<Task>;
  moveTask: (taskId: string, newListId: string | null) => Promise<Task>;
  deleteTask: (taskId: string, isHardDelete?: boolean) => Promise<Task>;
  undeleteTask: (taskId: string) => Promise<Task>;
  duplicateTask: (taskId: string) => Promise<Task>;
  completeTask: (taskId: string) => Promise<Task>;
  uncompleteTask: (taskId: string) => Promise<Task>;
  reorderTasks: (activeTaskId: string, overTaskId: string) => Promise<void>;
  // Selected
  selectedTaskDialogOpen: boolean;
  selectedTask: Task | null;
  setSelectedTaskDialogOpen: (selectedTaskDialogOpen: boolean, selectedTask?: Task | null) => void;
  // Highlighted Task
  highlightedTaskId: string | null;
  setHighlightedTaskId: (highlightedTaskId: string | null) => void;
};

export const useTasksStore = create<TasksStore>()((set, get) => ({
  /********** General **********/
  popoverOpen: false,
  setPopoverOpen: async (popoverOpen: boolean) => {
    const { popoverOpen: currentPopoverOpen } = get();
    const { reloadSelectedListTasks } = useListsStore.getState();

    set({
      popoverOpen,
    });

    if (popoverOpen && !currentPopoverOpen) {
      await reloadSelectedListTasks();
    }
  },
  openPopoverForTask: async (taskId: string) => {
    const { setPopoverOpen, setHighlightedTaskId, getTask } = get();
    const { getList, setSelectedList } = useListsStore.getState();

    await setPopoverOpen(true);

    const task = await getTask(taskId);
    if (!task) {
      return;
    }

    const list = task.listId ? await getList(task.listId) : null;

    await setSelectedList(list);

    setHighlightedTaskId(taskId);

    setTimeout(() => {
      const taskElement = document.getElementById(`task-${taskId}`);
      if (taskElement) {
        taskElement.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
        });
      }
    }, 100);

    setTimeout(() => {
      setHighlightedTaskId(null);
    }, 2000);
  },
  // Tasks List End Element
  listEndElement: null,
  setListEndElement: (listEndElement: HTMLElement | null) => {
    set({
      listEndElement,
    });
  },
  /********** Tasks **********/
  getTasksByQuery: async (query: string) => {
    return getTasks(query);
  },
  getTask: async (taskId: string) => {
    const task = await getTask(taskId);

    return task ?? null;
  },
  addTask: async (task: CreateTask) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();
    const { reloadCalendarEntriesDebounced } = useCalendarStore.getState();

    const addedTask = await addTask(task);

    globalEventsEmitter.emit(GlobalEventsEnum.TASKS_TASK_ADDED, {
      actorUserId: addedTask.userId,
      taskId: addedTask.id,
      task: addedTask,
    });

    await reloadTasksCountMap();
    await reloadSelectedListTasks();

    if (window.location.pathname.startsWith('/calendar')) {
      reloadCalendarEntriesDebounced();
    }

    return addedTask;
  },
  editTask: async (taskId: string, task: UpdateTask) => {
    const {
      lists,
      setSelectedList,
      reloadTasksCountMap,
      reloadSelectedListTasks,
      selectedListTasks,
    } = useListsStore.getState();
    const { reloadCalendarEntriesDebounced } = useCalendarStore.getState();

    const originalTask = selectedListTasks.find((task) => task.id === taskId);

    // In case we moved the task to another list, we need to update the counts of the lists,
    // and we also need to set that as the selected list
    const editedTask = await editTask(taskId, task);

    globalEventsEmitter.emit(GlobalEventsEnum.TASKS_TASK_EDITED, {
      actorUserId: editedTask.userId,
      taskId: editedTask.id,
      task: editedTask,
    });

    if (originalTask?.listId !== editedTask.listId) {
      const selectedList =
        lists.find((list) => {
          return list.id === editedTask.listId;
        }) ?? null;

      await setSelectedList(selectedList);

      await reloadTasksCountMap();
    }

    await reloadSelectedListTasks();

    if (window.location.pathname.startsWith('/calendar')) {
      reloadCalendarEntriesDebounced();
    }

    return editedTask;
  },
  moveTask: async (taskId: string, newListId: string | null) => {
    const { lists, setSelectedList, reloadSelectedListTasks, reloadTasksCountMap } =
      useListsStore.getState();

    const movedTask = await editTask(taskId, {
      listId: newListId,
    });

    globalEventsEmitter.emit(GlobalEventsEnum.TASKS_TASK_EDITED, {
      actorUserId: movedTask.userId,
      taskId: movedTask.id,
      task: movedTask,
    });

    const selectedList =
      lists.find((list) => {
        return list.id === newListId;
      }) ?? null;

    await setSelectedList(selectedList);

    await reloadSelectedListTasks();
    await reloadTasksCountMap();

    return movedTask;
  },
  deleteTask: async (taskId: string, isHardDelete?: boolean) => {
    const { reloadTasksCountMap, reloadSelectedListTasks } = useListsStore.getState();
    const { reloadCalendarEntriesDebounced } = useCalendarStore.getState();

    const deletedTask = await deleteTask(taskId, isHardDelete);

    globalEventsEmitter.emit(GlobalEventsEnum.TASKS_TASK_DELETED, {
      actorUserId: deletedTask.userId,
      taskId: deletedTask.id,
      task: deletedTask,
      isHardDelete,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();

    if (window.location.pathname.startsWith('/calendar')) {
      reloadCalendarEntriesDebounced();
    }

    return deletedTask;
  },
  undeleteTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

    const undeletedTask = await undeleteTask(taskId);

    globalEventsEmitter.emit(GlobalEventsEnum.TASKS_TASK_UNDELETED, {
      actorUserId: undeletedTask.userId,
      taskId: undeletedTask.id,
      task: undeletedTask,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();

    return undeletedTask;
  },
  duplicateTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

    const duplicatedTask = await duplicateTask(taskId);

    globalEventsEmitter.emit(GlobalEventsEnum.TASKS_TASK_UNDELETED, {
      actorUserId: duplicatedTask.userId,
      taskId: duplicatedTask.id,
      task: duplicatedTask,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();

    return duplicatedTask;
  },
  completeTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

    const completedTask = await completeTask(taskId);

    globalEventsEmitter.emit(GlobalEventsEnum.TASKS_TASK_COMPLETED, {
      actorUserId: completedTask.userId,
      taskId: completedTask.id,
      task: completedTask,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();

    return completedTask;
  },
  uncompleteTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

    const uncompletedTask = await uncompleteTask(taskId);

    globalEventsEmitter.emit(GlobalEventsEnum.TASKS_TASK_UNCOMPLETED, {
      actorUserId: uncompletedTask.userId,
      taskId: uncompletedTask.id,
      task: uncompletedTask,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();

    return uncompletedTask;
  },
  reorderTasks: async (originalTaskId: string, newTaskId: string) => {
    const {
      selectedList,
      selectedListTasks,
      setSelectedListTasks,
      reloadSelectedListTasks,
      selectedListTasksSortDirection,
    } = useListsStore.getState();

    // We want do an optimistic update to prevent the jump animation,
    // while the request is in progress.
    const originalTaskIndex = selectedListTasks.findIndex((task) => task.id === originalTaskId);
    const newTaskIndex = selectedListTasks.findIndex((task) => task.id === newTaskId);
    const newSelectedListTasks = arrayMove(selectedListTasks, originalTaskIndex, newTaskIndex);

    setSelectedListTasks(newSelectedListTasks);

    await reorderTask(
      originalTaskId,
      newTaskId,
      selectedListTasksSortDirection,
      selectedList?.id ?? null
    );

    await reloadSelectedListTasks();
  },
  // Selected
  selectedTaskDialogOpen: false,
  selectedTask: null,
  setSelectedTaskDialogOpen: (selectedTaskDialogOpen: boolean, selectedTask?: Task | null) => {
    set({
      selectedTaskDialogOpen,
      selectedTask,
    });
  },
  // Highlighted Task
  highlightedTaskId: null,
  setHighlightedTaskId: (highlightedTaskId: string | null) => {
    set({
      highlightedTaskId,
    });
  },
}));

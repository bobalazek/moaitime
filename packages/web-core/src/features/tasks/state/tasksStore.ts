import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';

import { CreateTask, Task, UpdateTask } from '@moaitime/shared-common';

import {
  addTask,
  completeTask,
  deleteTask,
  duplicateTask,
  editTask,
  getTasks,
  reorderTask,
  uncompleteTask,
  undeleteTask,
} from '../utils/TaskHelpers';
import { useListsStore } from './listsStore';
import { tasksEmitter, TasksEventsEnum } from './tasksEmitter';

export type TasksStore = {
  /********** General **********/
  popoverOpen: boolean;
  setPopoverOpen: (popoverOpen: boolean) => Promise<void>;
  // Tasks List End Element
  listEndElement: HTMLElement | null;
  setListEndElement: (listEndElement: HTMLElement | null) => void;
  /********** Tasks **********/
  getTasksByQuery: (query: string) => Promise<Task[]>;
  addTask: (task: CreateTask) => Promise<Task>;
  editTask: (taskId: string, task: UpdateTask) => Promise<Task>;
  moveTask: (taskId: string, newListId?: string) => Promise<Task>;
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
  addTask: async (task: CreateTask) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

    const addedTask = await addTask(task);

    tasksEmitter.emit(TasksEventsEnum.TASK_ADDED, {
      task: addedTask,
    });

    await reloadTasksCountMap();
    await reloadSelectedListTasks();

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

    const originalTask = selectedListTasks.find((task) => task.id === taskId);

    // In case we moved the task to another list, we need to update the counts of the lists,
    // and we also need to set that as the selected list
    const editedTask = await editTask(taskId, task);

    tasksEmitter.emit(TasksEventsEnum.TASK_EDITED, {
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

    return editedTask;
  },
  moveTask: async (taskId: string, newListId?: string) => {
    const { lists, setSelectedList, reloadSelectedListTasks, reloadTasksCountMap } =
      useListsStore.getState();

    const movedTask = await editTask(taskId, {
      listId: newListId,
    });

    tasksEmitter.emit(TasksEventsEnum.TASK_EDITED, {
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

    const deletedTask = await deleteTask(taskId, isHardDelete);

    tasksEmitter.emit(TasksEventsEnum.TASK_DELETED, {
      task: deletedTask,
      isHardDelete: !!isHardDelete,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();

    return deletedTask;
  },
  undeleteTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

    const undeletedTask = await undeleteTask(taskId);

    tasksEmitter.emit(TasksEventsEnum.TASK_UNDELETED, {
      task: undeletedTask,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();

    return undeletedTask;
  },
  duplicateTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

    const duplicatedTask = await duplicateTask(taskId);

    tasksEmitter.emit(TasksEventsEnum.TASK_UNDELETED, {
      task: duplicatedTask,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();

    return duplicatedTask;
  },
  completeTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

    const completedTask = await completeTask(taskId);

    tasksEmitter.emit(TasksEventsEnum.TASK_COMPLETED, {
      task: completedTask,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();

    return completedTask;
  },
  uncompleteTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = useListsStore.getState();

    const uncompletedTask = await uncompleteTask(taskId);

    tasksEmitter.emit(TasksEventsEnum.TASK_UNCOMPLETED, {
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

    await reorderTask(originalTaskId, newTaskId, selectedListTasksSortDirection, selectedList?.id);

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
}));

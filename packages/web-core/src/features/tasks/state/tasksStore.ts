import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';

import { CreateTask, Task, UpdateTask } from '@moaitime/shared-common';

import {
  addTask,
  completeTask,
  deleteTask,
  duplicateTask,
  editTask,
  reorderTask,
  uncompleteTask,
  undeleteTask,
} from '../utils/TasksHelpers';
import { useListsStore } from './listsStore';

export type TasksStore = {
  /********** General **********/
  popoverOpen: boolean;
  setPopoverOpen: (popoverOpen: boolean) => void;
  // Tasks List End Element
  listEndElement: HTMLElement | null;
  setListEndElement: (listEndElement: HTMLElement | null) => void;
  /********** Tasks **********/
  addTask: (task: CreateTask) => Promise<Task>;
  editTask: (taskId: string, task: UpdateTask) => Promise<Task>;
  moveTask: (taskId: string, newListId: string) => Promise<Task>;
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

export const useTasksStore = create<TasksStore>()((set) => ({
  /********** General **********/
  popoverOpen: false,
  setPopoverOpen: (popoverOpen: boolean) => {
    const { reloadLists } = useListsStore.getState();

    set({
      popoverOpen,
    });

    if (popoverOpen) {
      reloadLists();
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
  addTask: async (task: CreateTask) => {
    const { reloadSelectedListTasks, reloadLists } = useListsStore.getState();

    const addedTask = await addTask(task);

    await reloadLists(); // We want to reload the count of tasks
    await reloadSelectedListTasks();

    return addedTask;
  },
  editTask: async (taskId: string, task: UpdateTask) => {
    const { lists, setSelectedList, reloadLists, reloadSelectedListTasks, selectedListTasks } =
      useListsStore.getState();

    const originalTask = selectedListTasks.find((task) => task.id === taskId);

    // In case we moved the task to another list, we need to update the counts of the lists,
    // and we also need to set that as the selected list
    const editedTask = await editTask(taskId, task);
    if (task.listId && originalTask?.listId !== editedTask.listId) {
      const selectedList =
        lists.find((list) => {
          return list.id === editedTask.listId;
        }) ?? null;

      setSelectedList(selectedList);

      await reloadLists();
    }

    await reloadSelectedListTasks();

    return editedTask;
  },
  moveTask: async (taskId: string, newListId: string) => {
    const { lists, setSelectedList, reloadSelectedListTasks, reloadLists } =
      useListsStore.getState();

    const movedTask = await editTask(taskId, {
      listId: newListId,
    });
    const selectedList =
      lists.find((list) => {
        return list.id === newListId;
      }) ?? null;

    setSelectedList(selectedList);

    await reloadSelectedListTasks();
    // We need to update the counts of the lists, once it was moved to another list
    await reloadLists();

    return movedTask;
  },
  deleteTask: async (taskId: string, isHardDelete?: boolean) => {
    const { reloadLists, reloadSelectedListTasks } = useListsStore.getState();

    const deletedTask = await deleteTask(taskId, isHardDelete);

    await reloadSelectedListTasks();
    await reloadLists(); // We want to reload the count of tasks

    return deletedTask;
  },
  undeleteTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadLists } = useListsStore.getState();

    const undeletedTask = await undeleteTask(taskId);

    await reloadSelectedListTasks();
    await reloadLists(); // We want to reload the count of tasks

    return undeletedTask;
  },
  duplicateTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadLists } = useListsStore.getState();

    const duplicatedTask = await duplicateTask(taskId);

    await reloadSelectedListTasks();
    await reloadLists(); // We want to reload the count of tasks

    return duplicatedTask;
  },
  completeTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadLists } = useListsStore.getState();

    const completedTask = await completeTask(taskId);

    await reloadSelectedListTasks();
    await reloadLists(); // We want to reload the count of tasks

    return completedTask;
  },
  uncompleteTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadLists } = useListsStore.getState();

    const uncompletedTask = await uncompleteTask(taskId);

    await reloadSelectedListTasks();
    await reloadLists(); // We want to reload the count of tasks

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
    if (!selectedList) {
      return;
    }

    // We want do an optimistic update to prevent the jump animation,
    // while the request is in progress.
    const originalTaskIndex = selectedListTasks.findIndex((task) => task.id === originalTaskId);
    const newTaskIndex = selectedListTasks.findIndex((task) => task.id === newTaskId);
    const newSelectedListTasks = arrayMove(selectedListTasks, originalTaskIndex, newTaskIndex);
    setSelectedListTasks(newSelectedListTasks);

    await reorderTask(selectedList.id, originalTaskId, newTaskId, selectedListTasksSortDirection);

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

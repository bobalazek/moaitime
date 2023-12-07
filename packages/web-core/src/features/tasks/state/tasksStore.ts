import { create } from 'zustand';

import {
  ListInterface,
  SortDirectionEnum,
  TaskInterface,
  TasksListSortFieldEnum,
} from '@myzenbuddy/shared-common';

import {
  addList,
  addTask,
  completeTask,
  deleteList,
  deleteTask,
  editList,
  editTask,
  getTasksForList,
  loadLists,
  reorderTask,
  uncompleteTask,
  undeleteTask,
} from '../utils/TasksHelpers';

export type TasksStore = {
  /********** General **********/
  popoverOpen: boolean;
  setPopoverOpen: (popoverOpen: boolean) => void;
  // Tasks List End Element
  listEndElement: HTMLElement | null;
  setListEndElement: (listEndElement: HTMLElement | null) => void;
  /********** Lists **********/
  lists: ListInterface[];
  addList: (list: ListInterface) => Promise<ListInterface>;
  editList: (listId: string, list: Partial<ListInterface>) => Promise<ListInterface>;
  deleteList: (listId: string) => Promise<ListInterface | null>;
  loadLists: () => Promise<ListInterface[]>;
  // Selected
  selectedList: ListInterface | null;
  setSelectedList: (selectedList: ListInterface | null) => Promise<void>;
  reloadSelectedList: () => Promise<void>;
  // Form Dialog
  listFormDialogOpen: boolean;
  selectedListFormDialog: ListInterface | null;
  setListFormDialogOpen: (
    listDialogOpen: boolean,
    selectedListFormDialog?: ListInterface | null
  ) => void;
  saveListFormDialog: (list: Partial<ListInterface>) => Promise<ListInterface>;
  // Delete Alert Dialog
  listDeleteAlertDialogOpen: boolean;
  selectedListDeleteAlertDialog: ListInterface | null;
  setListDeleteAlertDialogOpen: (
    listDeleteAlertDialogOpen: boolean,
    selectedListDeleteAlertDialog?: ListInterface | null
  ) => void;
  /********** Tasks **********/
  addTask: (task: TaskInterface) => Promise<TaskInterface>;
  editTask: (taskId: string, task: Partial<TaskInterface>) => Promise<TaskInterface>;
  moveTask: (taskId: string, newListId: string) => Promise<TaskInterface>;
  deleteTask: (taskId: string) => Promise<TaskInterface>;
  undeleteTask: (taskId: string) => Promise<TaskInterface>;
  completeTask: (taskId: string) => Promise<TaskInterface>;
  uncompleteTask: (taskId: string) => Promise<TaskInterface>;
  reorderTasks: (activeTaskId: string, overTaskId: string) => void;
  // Selected
  selectedTaskDialogOpen: boolean;
  selectedTask: TaskInterface | null;
  setSelectedTaskDialogOpen: (
    selectedTaskDialogOpen: boolean,
    selectedTask?: TaskInterface | null
  ) => void;
  // Selected List Tasks
  selectedListTasks: TaskInterface[];
  selectedListTasksSortField: TasksListSortFieldEnum;
  selectedListTasksSortDirection: SortDirectionEnum;
  selectedListTasksIncludeCompleted: boolean;
  selectedListTasksIncludeDeleted: boolean;
  setSelectedListTasksSortField: (selectedListTasksSortField: TasksListSortFieldEnum) => void;
  setSelectedListTasksSortDirection: (selectedListTasksSortDirection: SortDirectionEnum) => void;
  setSelectedListTasksIncludeCompleted: (selectedListTasksIncludeCompleted: boolean) => void;
  setSelectedListTasksIncludeDeleted: (selectedListTasksIncludeDeleted: boolean) => void;
};

export const useTasksStore = create<TasksStore>()((set, get) => ({
  /********** General **********/
  popoverOpen: false,
  setPopoverOpen: (popoverOpen: boolean) => {
    const { loadLists } = get();

    set({
      popoverOpen,
    });

    if (popoverOpen) {
      loadLists();
    }
  },
  // Tasks List End Element
  listEndElement: null,
  setListEndElement: (listEndElement: HTMLElement | null) => {
    set({
      listEndElement,
    });
  },
  /********** Lists **********/
  lists: [],
  addList: async (list: ListInterface) => {
    const { loadLists } = get();
    const addedList = await addList(list);

    await loadLists();

    return addedList;
  },
  editList: async (listId: string, list: Partial<ListInterface>) => {
    const { loadLists } = get();
    const editedList = await editList(listId, list);

    await loadLists();

    return editedList;
  },
  deleteList: async (listId: string) => {
    const { loadLists, selectedList } = get();
    const deletedList = await deleteList(listId);

    await loadLists();

    if (selectedList?.id === listId) {
      set({
        selectedList: null,
        selectedListTasks: [],
      });
    }

    return deletedList;
  },
  loadLists: async () => {
    const lists = await loadLists();

    set({ lists });

    return lists;
  },
  // Selected
  selectedList: null,
  setSelectedList: async (selectedList: ListInterface | null) => {
    const { reloadSelectedList } = get();

    set({
      selectedList,
    });

    await reloadSelectedList();
  },
  reloadSelectedList: async () => {
    const {
      selectedList,
      selectedListTasksSortField,
      selectedListTasksSortDirection,
      selectedListTasksIncludeCompleted,
      selectedListTasksIncludeDeleted,
    } = get();

    const selectedListTasks = selectedList
      ? await getTasksForList(selectedList.id, {
          sortField: selectedListTasksSortField,
          sortDirection: selectedListTasksSortDirection,
          includeCompleted: selectedListTasksIncludeCompleted,
          includeDeleted: selectedListTasksIncludeDeleted,
        })
      : [];

    set({
      selectedListTasks,
    });
  },
  // Form Dialog
  listFormDialogOpen: false,
  selectedListFormDialog: null,
  setListFormDialogOpen: (
    listFormDialogOpen: boolean,
    selectedListFormDialog?: ListInterface | null
  ) => {
    set({
      listFormDialogOpen,
      selectedListFormDialog,
    });
  },
  saveListFormDialog: async (list: Partial<ListInterface>) => {
    const { selectedListFormDialog, reloadSelectedList, loadLists } = get();

    const savedList = selectedListFormDialog
      ? await editList(selectedListFormDialog.id, list)
      : await addList(list as ListInterface);

    set({
      listFormDialogOpen: false,
      popoverOpen: true,
      selectedList: savedList,
      lists: await loadLists(),
    });

    await reloadSelectedList();

    return savedList;
  },
  // Delete Alert Dialog
  listDeleteAlertDialogOpen: false,
  selectedListDeleteAlertDialog: null,
  setListDeleteAlertDialogOpen: (
    listDeleteAlertDialogOpen: boolean,
    selectedListDeleteAlertDialog?: ListInterface | null
  ) => {
    set({
      listDeleteAlertDialogOpen,
      selectedListDeleteAlertDialog,
    });
  },
  /********** Tasks **********/
  addTask: async (task: TaskInterface) => {
    const { reloadSelectedList, loadLists } = get();

    const addedTask = await addTask(task);

    set({
      selectedListTasks: await getTasksForList(task.listId),
      lists: await loadLists(), // We want to reload the count of tasks
    });

    await reloadSelectedList();

    return addedTask;
  },
  editTask: async (taskId: string, task: Partial<TaskInterface>) => {
    const { reloadSelectedList } = get();

    const editedTask = await editTask(taskId, task);

    await reloadSelectedList();

    return editedTask;
  },
  moveTask: async (taskId: string, newListId: string) => {
    const { lists, reloadSelectedList, loadLists } = get();

    const movedTask = await editTask(taskId, {
      listId: newListId,
    });
    const selectedList =
      lists.find((list) => {
        return list.id === newListId;
      }) ?? null;

    set({
      selectedList,
    });

    await reloadSelectedList();

    // We need to update the counts of the lists, once it was moved to another list
    await loadLists();

    return movedTask;
  },
  deleteTask: async (taskId: string) => {
    const { reloadSelectedList, loadLists } = get();

    const deletedTask = await deleteTask(taskId);

    await reloadSelectedList();

    set({
      lists: await loadLists(), // We want to reload the count of tasks
    });

    return deletedTask;
  },
  undeleteTask: async (taskId: string) => {
    const { reloadSelectedList, loadLists } = get();

    const undeletedTask = await undeleteTask(taskId);

    await reloadSelectedList();

    set({
      lists: await loadLists(), // We want to reload the count of tasks
    });

    return undeletedTask;
  },
  completeTask: async (taskId: string) => {
    const { reloadSelectedList, loadLists } = get();

    const completedTask = await completeTask(taskId);

    set({
      lists: await loadLists(), // We want to reload the count of tasks
    });

    await reloadSelectedList();

    return completedTask;
  },
  uncompleteTask: async (taskId: string) => {
    const { reloadSelectedList, loadLists } = get();

    const uncompletedTask = await uncompleteTask(taskId);

    set({
      lists: await loadLists(), // We want to reload the count of tasks
    });

    await reloadSelectedList();

    return uncompletedTask;
  },
  reorderTasks: async (originalTaskId: string, newTaskId: string) => {
    const { selectedList, reloadSelectedList, selectedListTasksSortDirection } = get();
    if (!selectedList) {
      return;
    }

    await reorderTask(selectedList.id, originalTaskId, newTaskId, selectedListTasksSortDirection);

    await reloadSelectedList();
  },
  // Selected
  selectedTaskDialogOpen: false,
  selectedTask: null,
  setSelectedTaskDialogOpen: (
    selectedTaskDialogOpen: boolean,
    selectedTask?: TaskInterface | null
  ) => {
    set({
      selectedTaskDialogOpen,
      selectedTask,
    });
  },
  // Selected List Tasks
  selectedListTasks: [],
  selectedListTasksSortField: TasksListSortFieldEnum.ORDER,
  selectedListTasksSortDirection: SortDirectionEnum.ASC,
  selectedListTasksIncludeCompleted: true,
  selectedListTasksIncludeDeleted: false,
  setSelectedListTasksSortField: async (selectedListTasksSortField: TasksListSortFieldEnum) => {
    const { reloadSelectedList } = get();

    set({
      selectedListTasksSortField,
    });

    await reloadSelectedList();
  },
  setSelectedListTasksSortDirection: async (selectedListTasksSortDirection: SortDirectionEnum) => {
    const { reloadSelectedList } = get();

    set({
      selectedListTasksSortDirection,
    });

    await reloadSelectedList();
  },
  setSelectedListTasksIncludeCompleted: async (selectedListTasksIncludeCompleted: boolean) => {
    const { reloadSelectedList } = get();

    set({
      selectedListTasksIncludeCompleted,
    });

    await reloadSelectedList();
  },
  setSelectedListTasksIncludeDeleted: async (selectedListTasksIncludeDeleted: boolean) => {
    const { reloadSelectedList } = get();

    set({
      selectedListTasksIncludeDeleted,
    });

    await reloadSelectedList();
  },
}));

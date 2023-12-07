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
  deleteList,
  deleteTask,
  editList,
  editTask,
  getList,
  getTasksForList,
  loadLists,
  OmitedList,
  OmitedTask,
  reorderTask,
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
  addList: (list: OmitedList) => Promise<ListInterface>;
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
  addTask: (task: OmitedTask) => Promise<TaskInterface>;
  editTask: (task: TaskInterface) => Promise<TaskInterface>;
  moveTask: (task: TaskInterface) => Promise<TaskInterface>;
  deleteTask: (task: TaskInterface) => Promise<TaskInterface>;
  undeleteTask: (task: TaskInterface) => Promise<TaskInterface>;
  reorderTasks: (activeId: string, overId: string) => void;
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
  addList: async (list: OmitedList) => {
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
    const response = await loadLists();
    const lists = response.data ?? [];

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
      loadLists,
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

    // In case the task in a list was moved to another list, so we need to update the count for those lists
    await loadLists();
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
      : await addList(list as OmitedList);

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
  addTask: async (task: OmitedTask) => {
    const { reloadSelectedList, loadLists } = get();

    const addedTask = await addTask(task);

    set({
      selectedListTasks: await getTasksForList(task.listId),
      lists: await loadLists(), // We want to reload the count of tasks
    });

    await reloadSelectedList();

    return addedTask;
  },
  editTask: async (taksListItem: TaskInterface) => {
    const { reloadSelectedList } = get();

    const editedTask = await editTask(taksListItem.id, taksListItem);

    set({
      selectedListTasks: await getTasksForList(taksListItem.listId),
    });

    await reloadSelectedList();

    return editedTask;
  },
  moveTask: async (task: TaskInterface) => {
    const { reloadSelectedList } = get();

    const movedTask = await editTask(task.id, {
      listId: task.listId,
    });
    const selectedList = task.listId ? await getList(task.listId) : null;

    set({
      selectedListTasks: await getTasksForList(task.listId),
      selectedList,
    });

    await reloadSelectedList();

    return movedTask;
  },
  deleteTask: async (task: TaskInterface) => {
    const { reloadSelectedList, loadLists } = get();

    const deletedTask = await deleteTask(task.id);

    set({
      selectedListTasks: await getTasksForList(task.listId),
      lists: await loadLists(), // We want to reload the count of tasks
    });

    await reloadSelectedList();

    return deletedTask;
  },
  undeleteTask: async (task: TaskInterface) => {
    const { reloadSelectedList, loadLists } = get();

    const undeletedTask = await editTask(task.id, {
      deletedAt: undefined,
    });

    set({
      selectedListTasks: await getTasksForList(task.listId),
      lists: await loadLists(), // We want to reload the count of tasks
    });

    await reloadSelectedList();

    return undeletedTask;
  },
  reorderTasks: async (originalTaskId: string, newTaskId: string) => {
    const { selectedList, reloadSelectedList, selectedListTasksSortDirection } = get();
    if (!selectedList) {
      return;
    }

    await reorderTask(originalTaskId, newTaskId, selectedListTasksSortDirection);

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

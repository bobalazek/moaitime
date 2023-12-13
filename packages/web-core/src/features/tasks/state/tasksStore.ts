import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';

import {
  List,
  SortDirectionEnum,
  Task,
  TasksListSortFieldEnum,
  UpdateTask,
} from '@moaitime/shared-common';

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
  lists: List[];
  addList: (list: List) => Promise<List>;
  editList: (listId: string, list: Partial<List>) => Promise<List>;
  deleteList: (listId: string) => Promise<List | null>;
  loadLists: () => Promise<List[]>;
  // Selected
  selectedList: List | null;
  setSelectedList: (selectedList: List | null) => Promise<void>;
  reloadSelectedList: () => Promise<void>;
  // Form Dialog
  listFormDialogOpen: boolean;
  selectedListFormDialog: List | null;
  setListFormDialogOpen: (listDialogOpen: boolean, selectedListFormDialog?: List | null) => void;
  saveListFormDialog: (list: Partial<List>) => Promise<List>;
  // Delete Alert Dialog
  listDeleteAlertDialogOpen: boolean;
  selectedListDeleteAlertDialog: List | null;
  setListDeleteAlertDialogOpen: (
    listDeleteAlertDialogOpen: boolean,
    selectedListDeleteAlertDialog?: List | null
  ) => void;
  /********** Tasks **********/
  addTask: (task: Task) => Promise<Task>;
  editTask: (taskId: string, task: UpdateTask) => Promise<Task>;
  moveTask: (taskId: string, newListId: string) => Promise<Task>;
  deleteTask: (taskId: string, isHardDelete?: boolean) => Promise<Task>;
  undeleteTask: (taskId: string) => Promise<Task>;
  completeTask: (taskId: string) => Promise<Task>;
  uncompleteTask: (taskId: string) => Promise<Task>;
  reorderTasks: (activeTaskId: string, overTaskId: string) => Promise<void>;
  // Selected
  selectedTaskDialogOpen: boolean;
  selectedTask: Task | null;
  setSelectedTaskDialogOpen: (selectedTaskDialogOpen: boolean, selectedTask?: Task | null) => void;
  // Selected List Tasks
  selectedListTasks: Task[];
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
  addList: async (list: List) => {
    const { loadLists } = get();
    const addedList = await addList(list);

    await loadLists();

    return addedList;
  },
  editList: async (listId: string, list: Partial<List>) => {
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
    const { selectedListTasksIncludeCompleted, selectedListTasksIncludeDeleted } = get();

    const lists = await loadLists({
      includeCompleted: selectedListTasksIncludeCompleted,
      includeDeleted: selectedListTasksIncludeDeleted,
    });

    set({ lists });

    return lists;
  },
  // Selected
  selectedList: null,
  setSelectedList: async (selectedList: List | null) => {
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
  setListFormDialogOpen: (listFormDialogOpen: boolean, selectedListFormDialog?: List | null) => {
    set({
      listFormDialogOpen,
      selectedListFormDialog,
    });
  },
  saveListFormDialog: async (list: Partial<List>) => {
    const { selectedListFormDialog, reloadSelectedList, loadLists } = get();

    const savedList = selectedListFormDialog
      ? await editList(selectedListFormDialog.id, list)
      : await addList(list as List);

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
    selectedListDeleteAlertDialog?: List | null
  ) => {
    set({
      listDeleteAlertDialogOpen,
      selectedListDeleteAlertDialog,
    });
  },
  /********** Tasks **********/
  addTask: async (task: Task) => {
    const { reloadSelectedList, loadLists } = get();

    const addedTask = await addTask(task);

    set({
      lists: await loadLists(), // We want to reload the count of tasks
    });

    await reloadSelectedList();

    return addedTask;
  },
  editTask: async (taskId: string, task: UpdateTask) => {
    const { lists, loadLists, reloadSelectedList, selectedListTasks } = get();

    const originalTask = selectedListTasks.find((task) => task.id === taskId);

    // In case we moved the task to another list, we need to update the counts of the lists,
    // and we also need to set that as the selected list
    const editedTask = await editTask(taskId, task);
    if (task.listId && originalTask?.listId !== editedTask.listId) {
      const selectedList = lists.find((list) => {
        return list.id === editedTask.listId;
      });

      set({
        selectedList,
      });

      await loadLists();
    }

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
  deleteTask: async (taskId: string, isHardDelete?: boolean) => {
    const { reloadSelectedList, loadLists } = get();

    const deletedTask = await deleteTask(taskId, isHardDelete);

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
    const { selectedList, selectedListTasks, reloadSelectedList, selectedListTasksSortDirection } =
      get();
    if (!selectedList) {
      return;
    }

    // We want do an optimistic update to prevent the jump animation,
    // while the request is in progress.
    const originalTaskIndex = selectedListTasks.findIndex((task) => task.id === originalTaskId);
    const newTaskIndex = selectedListTasks.findIndex((task) => task.id === newTaskId);
    const newSelectedListTasks = arrayMove(selectedListTasks, originalTaskIndex, newTaskIndex);
    set({
      selectedListTasks: newSelectedListTasks,
    });

    await reorderTask(selectedList.id, originalTaskId, newTaskId, selectedListTasksSortDirection);

    await reloadSelectedList();
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
    const { reloadSelectedList, loadLists } = get();

    set({
      selectedListTasksIncludeCompleted,
    });

    await reloadSelectedList();
    await loadLists();
  },
  setSelectedListTasksIncludeDeleted: async (selectedListTasksIncludeDeleted: boolean) => {
    const { reloadSelectedList, loadLists } = get();

    set({
      selectedListTasksIncludeDeleted,
    });

    await reloadSelectedList();
    await loadLists();
  },
}));

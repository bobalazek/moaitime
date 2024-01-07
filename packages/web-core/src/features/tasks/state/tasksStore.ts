import { arrayMove } from '@dnd-kit/sortable';
import { create } from 'zustand';

import {
  CreateList,
  CreateTask,
  List,
  SortDirectionEnum,
  Task,
  TasksListSortFieldEnum,
  UpdateList,
  UpdateTask,
} from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import { useCalendarStore } from '../../calendar/state/calendarStore';
import {
  addList,
  addTask,
  addVisibleList,
  completeTask,
  deleteList,
  deleteTask,
  duplicateTask,
  editList,
  editTask,
  getTasksForList,
  loadLists,
  removeVisibleList,
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
  reloadLists: () => Promise<List[]>;
  addList: (list: CreateList) => Promise<List>;
  editList: (listId: string, list: UpdateList) => Promise<List>;
  deleteList: (listId: string) => Promise<List | null>;
  addVisibleList: (listId: string) => Promise<void>;
  removeVisibleList: (listId: string) => Promise<void>;
  // Selected
  selectedList: List | null;
  setSelectedList: (selectedList: List | null) => Promise<List | null>;
  // List Dialog
  selectedListDialogOpen: boolean;
  selectedListDialog: List | null;
  setSelectedListDialogOpen: (
    selectedListDialogOpen: boolean,
    selectedListDialog?: List | null
  ) => void;
  // Delete Alert Dialog
  listDeleteAlertDialogOpen: boolean;
  selectedListDeleteAlertDialog: List | null;
  setListDeleteAlertDialogOpen: (
    listDeleteAlertDialogOpen: boolean,
    selectedListDeleteAlertDialog?: List | null
  ) => void;
  // Selected List Tasks
  selectedListTasks: Task[];
  selectedListTasksSortField: TasksListSortFieldEnum;
  selectedListTasksSortDirection: SortDirectionEnum;
  selectedListTasksIncludeCompleted: boolean;
  selectedListTasksIncludeDeleted: boolean;
  setSelectedListTasks: (selectedListTasks: Task[]) => void;
  reloadSelectedListTasks: () => Promise<void>;
  setSelectedListTasksSortField: (selectedListTasksSortField: TasksListSortFieldEnum) => void;
  setSelectedListTasksSortDirection: (selectedListTasksSortDirection: SortDirectionEnum) => void;
  setSelectedListTasksIncludeCompleted: (selectedListTasksIncludeCompleted: boolean) => void;
  setSelectedListTasksIncludeDeleted: (selectedListTasksIncludeDeleted: boolean) => void;
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

export const useTasksStore = create<TasksStore>()((set, get) => ({
  /********** General **********/
  popoverOpen: false,
  setPopoverOpen: (popoverOpen: boolean) => {
    const { reloadLists } = get();

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
  /********** Lists **********/
  lists: [],
  reloadLists: async () => {
    const { selectedListTasksIncludeCompleted, selectedListTasksIncludeDeleted, selectedList } =
      get();

    const lists = await loadLists({
      includeCompleted: selectedListTasksIncludeCompleted,
      includeDeleted: selectedListTasksIncludeDeleted,
    });

    const newSelectedList =
      lists.find((list) => {
        return list.id === selectedList?.id;
      }) ?? null;

    set({
      lists,
      selectedList: newSelectedList,
    });

    return lists;
  },
  addList: async (list: CreateList) => {
    const { reloadLists, setSelectedList } = get();
    const addedList = await addList(list);

    await reloadLists();
    await setSelectedList(addedList);

    return addedList;
  },
  editList: async (listId: string, list: UpdateList) => {
    const { reloadLists, reloadSelectedListTasks } = get();
    const editedList = await editList(listId, list);

    await reloadLists();
    await reloadSelectedListTasks();

    return editedList;
  },
  deleteList: async (listId: string) => {
    const { reloadLists, selectedList } = get();
    const deletedList = await deleteList(listId);

    await reloadLists();

    if (selectedList?.id === listId) {
      set({
        selectedList: null,
        selectedListTasks: [],
      });
    }

    return deletedList;
  },
  addVisibleList: async (listId: string) => {
    const { loadCalendarEntries } = useCalendarStore.getState();
    const { loadAccount } = useAuthStore.getState();

    await addVisibleList(listId);

    // We update the settings, so we need to refresh the account
    await loadAccount();

    await loadCalendarEntries();
  },
  removeVisibleList: async (listId: string) => {
    const { loadCalendarEntries } = useCalendarStore.getState();
    const { loadAccount } = useAuthStore.getState();

    await removeVisibleList(listId);

    // Same as above
    await loadAccount();

    await loadCalendarEntries();
  },
  // Selected
  selectedList: null,
  setSelectedList: async (selectedList: List | null) => {
    const { reloadSelectedListTasks } = get();

    set({
      selectedList,
    });

    await reloadSelectedListTasks();

    return selectedList;
  },
  // List Dialog
  selectedListDialogOpen: false,
  selectedListDialog: null,
  setSelectedListDialogOpen: (
    selectedListDialogOpen: boolean,
    selectedListDialog?: List | null
  ) => {
    set({
      selectedListDialogOpen,
      selectedListDialog,
    });
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
  // Selected List Tasks
  selectedListTasks: [],
  selectedListTasksSortField: TasksListSortFieldEnum.ORDER,
  selectedListTasksSortDirection: SortDirectionEnum.ASC,
  selectedListTasksIncludeCompleted: true,
  selectedListTasksIncludeDeleted: false,
  setSelectedListTasks: (selectedListTasks: Task[]) => {
    set({
      selectedListTasks,
    });
  },
  reloadSelectedListTasks: async () => {
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

    // If we are on the calendar page, we need to reload the calendar entries
    const { calendars, loadCalendarEntries } = useCalendarStore.getState();
    if (calendars.length > 0) {
      await loadCalendarEntries();
    }
  },
  setSelectedListTasksSortField: async (selectedListTasksSortField: TasksListSortFieldEnum) => {
    const { reloadSelectedListTasks } = get();

    set({
      selectedListTasksSortField,
    });

    await reloadSelectedListTasks();
  },
  setSelectedListTasksSortDirection: async (selectedListTasksSortDirection: SortDirectionEnum) => {
    const { reloadSelectedListTasks } = get();

    set({
      selectedListTasksSortDirection,
    });

    await reloadSelectedListTasks();
  },
  setSelectedListTasksIncludeCompleted: async (selectedListTasksIncludeCompleted: boolean) => {
    const { reloadSelectedListTasks, reloadLists } = get();

    set({
      selectedListTasksIncludeCompleted,
    });

    await reloadSelectedListTasks();
    await reloadLists();
  },
  setSelectedListTasksIncludeDeleted: async (selectedListTasksIncludeDeleted: boolean) => {
    const { reloadSelectedListTasks, reloadLists } = get();

    set({
      selectedListTasksIncludeDeleted,
    });

    await reloadSelectedListTasks();
    await reloadLists();
  },
  /********** Tasks **********/
  addTask: async (task: CreateTask) => {
    const { reloadSelectedListTasks, reloadLists } = get();

    const addedTask = await addTask(task);

    await reloadLists(), // We want to reload the count of tasks
      await reloadSelectedListTasks();

    return addedTask;
  },
  editTask: async (taskId: string, task: UpdateTask) => {
    const { lists, reloadLists, reloadSelectedListTasks, selectedListTasks } = get();

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

      await reloadLists();
    }

    await reloadSelectedListTasks();

    return editedTask;
  },
  moveTask: async (taskId: string, newListId: string) => {
    const { lists, reloadSelectedListTasks, reloadLists } = get();

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

    await reloadSelectedListTasks();
    // We need to update the counts of the lists, once it was moved to another list
    await reloadLists();

    return movedTask;
  },
  deleteTask: async (taskId: string, isHardDelete?: boolean) => {
    const { reloadLists, reloadSelectedListTasks } = get();

    const deletedTask = await deleteTask(taskId, isHardDelete);

    await reloadSelectedListTasks();

    await reloadLists(); // We want to reload the count of tasks

    return deletedTask;
  },
  undeleteTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadLists } = get();

    const undeletedTask = await undeleteTask(taskId);

    await reloadSelectedListTasks();
    await reloadLists(); // We want to reload the count of tasks

    return undeletedTask;
  },
  duplicateTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadLists } = get();

    const duplicatedTask = await duplicateTask(taskId);

    await reloadSelectedListTasks();
    await reloadLists(); // We want to reload the count of tasks

    return duplicatedTask;
  },
  completeTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadLists } = get();

    const completedTask = await completeTask(taskId);

    await reloadSelectedListTasks();
    await reloadLists(); // We want to reload the count of tasks

    return completedTask;
  },
  uncompleteTask: async (taskId: string) => {
    const { reloadSelectedListTasks, reloadLists } = get();

    const uncompletedTask = await uncompleteTask(taskId);

    await reloadSelectedListTasks();
    await reloadLists(); // We want to reload the count of tasks

    return uncompletedTask;
  },
  reorderTasks: async (originalTaskId: string, newTaskId: string) => {
    const {
      selectedList,
      selectedListTasks,
      reloadSelectedListTasks,
      selectedListTasksSortDirection,
    } = get();
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

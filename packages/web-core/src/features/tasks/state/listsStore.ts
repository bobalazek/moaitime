import { create } from 'zustand';

import {
  CreateList,
  List,
  SortDirectionEnum,
  Task,
  TasksListSortFieldEnum,
  UpdateList,
} from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import { useUserLimitsAndUsageStore } from '../../auth/state/userLimitsAndUsageStore';
import { useCalendarStore } from '../../calendar/state/calendarStore';
import {
  addList,
  addVisibleList,
  deleteList,
  editList,
  getDeletedLists,
  getList,
  getLists,
  getTasksCountMap,
  getTasksForList,
  removeVisibleList,
  undeleteList,
} from '../utils/ListHelpers';

export type ListsStore = {
  /********** Lists **********/
  lists: List[];
  reloadLists: () => Promise<List[]>;
  getList: (listId: string) => Promise<List | null>;
  addList: (data: CreateList) => Promise<List>;
  editList: (listId: string, data: UpdateList) => Promise<List>;
  deleteList: (listId: string, isHardDelete?: boolean) => Promise<List | null>;
  undeleteList: (listId: string) => Promise<List | null>;
  addVisibleList: (listId: string) => Promise<void>;
  removeVisibleList: (listId: string) => Promise<void>;
  // Tasks Count Map
  tasksCountMap: Record<string, number>;
  reloadTasksCountMap: () => Promise<Record<string, number>>;
  // Selected
  selectedList: List | null;
  setSelectedList: (selectedList: List | null) => Promise<List | null>;
  // Deleted
  deletedListsDialogOpen: boolean;
  setDeletedListsDialogOpen: (deletedListsDialogOpen: boolean) => void;
  deletedLists: List[];
  reloadDeletedLists: () => Promise<List[]>;
  // Selected List Dialog
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
};

export const useListsStore = create<ListsStore>()((set, get) => ({
  /********** Lists **********/
  lists: [],
  reloadLists: async () => {
    const { selectedListTasksIncludeCompleted, selectedListTasksIncludeDeleted, selectedList } =
      get();

    const lists = await getLists({
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
  getList: async (listId: string) => {
    const list = await getList(listId);

    return list ?? null;
  },
  addList: async (data: CreateList) => {
    const { reloadLists, setSelectedList } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const addedList = await addList(data);

    await reloadLists();
    await setSelectedList(addedList);
    await reloadUserUsage();

    return addedList;
  },
  editList: async (listId: string, data: UpdateList) => {
    const { reloadLists, reloadSelectedListTasks } = get();

    const editedList = await editList(listId, data);

    await reloadLists();
    await reloadSelectedListTasks();

    return editedList;
  },
  deleteList: async (listId: string, isHardDelete?: boolean) => {
    const {
      reloadLists,
      reloadSelectedListTasks,
      reloadDeletedLists,
      deletedListsDialogOpen,
      selectedList,
    } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const deletedList = await deleteList(listId, isHardDelete);

    await reloadLists();
    await reloadSelectedListTasks();
    await reloadUserUsage();

    if (selectedList?.id === listId) {
      set({
        selectedList: null,
        selectedListTasks: [],
      });
    }

    if (deletedListsDialogOpen) {
      await reloadDeletedLists();
    }

    return deletedList;
  },
  undeleteList: async (listId: string) => {
    const { reloadLists, reloadSelectedListTasks, reloadDeletedLists, deletedListsDialogOpen } =
      get();

    const undeletedList = await undeleteList(listId);

    await reloadLists();
    await reloadSelectedListTasks();

    if (deletedListsDialogOpen) {
      await reloadDeletedLists();
    }

    return undeletedList;
  },
  addVisibleList: async (listId: string) => {
    const { reloadCalendarEntriesDebounced } = useCalendarStore.getState();
    const { reloadAccount } = useAuthStore.getState();

    await addVisibleList(listId);

    // We update the settings, so we need to refresh the account
    await reloadAccount();
    await reloadCalendarEntriesDebounced();
  },
  removeVisibleList: async (listId: string) => {
    const { reloadCalendarEntriesDebounced } = useCalendarStore.getState();
    const { reloadAccount } = useAuthStore.getState();

    await removeVisibleList(listId);

    // Same as above
    await reloadAccount();
    await reloadCalendarEntriesDebounced();
  },
  // Tasks Count Map
  tasksCountMap: {},
  reloadTasksCountMap: async () => {
    const { selectedListTasksIncludeCompleted, selectedListTasksIncludeDeleted } = get();

    const tasksCountMap = await getTasksCountMap({
      includeCompleted: selectedListTasksIncludeCompleted,
      includeDeleted: selectedListTasksIncludeDeleted,
    });

    set({
      tasksCountMap,
    });

    return tasksCountMap;
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
  // Deleted
  deletedListsDialogOpen: false,
  setDeletedListsDialogOpen: (deletedListsDialogOpen: boolean) => {
    const { reloadDeletedLists } = get();

    if (deletedListsDialogOpen) {
      reloadDeletedLists();
    }

    set({
      deletedListsDialogOpen,
    });
  },
  deletedLists: [],
  reloadDeletedLists: async () => {
    const deletedLists = await getDeletedLists();

    set({
      deletedLists,
    });

    return deletedLists;
  },
  // Selected List Dialog
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

    const selectedListTasks = await getTasksForList(selectedList?.id, {
      sortField: selectedListTasksSortField,
      sortDirection: selectedListTasksSortDirection,
      includeCompleted: selectedListTasksIncludeCompleted,
      includeDeleted: selectedListTasksIncludeDeleted,
    });

    set({
      selectedListTasks,
    });
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
    const { reloadSelectedListTasks, reloadTasksCountMap } = get();

    set({
      selectedListTasksIncludeCompleted,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();
  },
  setSelectedListTasksIncludeDeleted: async (selectedListTasksIncludeDeleted: boolean) => {
    const { reloadSelectedListTasks, reloadTasksCountMap } = get();

    set({
      selectedListTasksIncludeDeleted,
    });

    await reloadSelectedListTasks();
    await reloadTasksCountMap();
  },
}));

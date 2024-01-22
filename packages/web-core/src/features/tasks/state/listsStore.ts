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
import { useCalendarStore } from '../../calendar/state/calendarStore';
import {
  addList,
  addVisibleList,
  deleteList,
  editList,
  getLists,
  getTasksCountMap,
  getTasksForList,
  removeVisibleList,
} from '../utils/ListHelpers';

export type ListsStore = {
  /********** Lists **********/
  lists: List[];
  reloadLists: () => Promise<List[]>;
  addList: (list: CreateList) => Promise<List>;
  editList: (listId: string, list: UpdateList) => Promise<List>;
  deleteList: (listId: string) => Promise<List | null>;
  addVisibleList: (listId: string) => Promise<void>;
  removeVisibleList: (listId: string) => Promise<void>;
  // Tasks Count Map
  tasksCountMap: Record<string, number>;
  reloadTasksCountMap: () => Promise<Record<string, number>>;
  // Selected
  selectedList: List | null;
  setSelectedList: (selectedList: List | null) => Promise<List | null>;
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
    const { reloadLists, reloadSelectedListTasks, selectedList } = get();
    const deletedList = await deleteList(listId);

    await reloadLists();
    await reloadSelectedListTasks();

    if (selectedList?.id === listId) {
      set({
        selectedList: null,
        selectedListTasks: [],
      });
    }

    return deletedList;
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

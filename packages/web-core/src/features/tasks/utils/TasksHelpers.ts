import { ListInterface, SortDirectionEnum, TaskInterface } from '@myzenbuddy/shared-common';

export type OmitedList = Omit<ListInterface, 'id' | 'order' | 'createdAt' | 'updatedAt'>;
export type OmitedTask = Omit<TaskInterface, 'id' | 'order' | 'createdAt' | 'updatedAt'>;

/********** Database **********/
let _databaseLists: ListInterface[] = [];
const _databaseTasks: TaskInterface[] = [];

/********** Lists **********/
export const getLists = async (): Promise<ListInterface[]> => {
  const lists: ListInterface[] = [];

  for (const list of _databaseLists) {
    const listTasks = await getTasksForList(list.id);

    lists.push({
      ...list,
      tasksCount: listTasks.length,
    });
  }

  return lists;
};

export const getList = async (listId: string): Promise<ListInterface | null> => {
  const lists = await getLists();

  return lists.find((list) => list.id === listId) ?? null;
};

export const setLists = async (lists: ListInterface[]): Promise<ListInterface[]> => {
  _databaseLists = [...lists];

  return getLists();
};

export const validateList = (list: Partial<ListInterface>, action: 'add' | 'edit') => {
  if (!list.id && action === 'edit') {
    throw new Error('ID is required');
  }

  if (typeof list.name !== 'undefined' && !list.name) {
    throw new Error('Name is required');
  }
};

export const addList = async (list: OmitedList): Promise<ListInterface> => {
  validateList(list, 'add');

  const addedList = { ...list, id: Date.now().toString() };

  _databaseLists.push(addedList);

  return addedList;
};

export const editList = async (list: ListInterface): Promise<ListInterface> => {
  validateList(list, 'edit');

  const listIndex = _databaseLists.findIndex((t) => t.id === list.id);
  if (listIndex >= 0) {
    _databaseLists[listIndex] = list;
  }

  return list;
};

export const deleteList = async (listId: string): Promise<ListInterface | null> => {
  const deletedList = await getList(listId);

  const listIndex = _databaseLists.findIndex((list) => list.id === listId);
  if (listIndex >= 0) {
    _databaseLists.splice(listIndex, 1);
  }

  return deletedList;
};

/********** Tasks **********/
export const getTasksForList = async (
  listId?: string,
  options?: {
    includeCompleted?: boolean;
    includeDeleted?: boolean;
    sortField?: string;
    sortDirection?: SortDirectionEnum;
  }
): Promise<TaskInterface[]> => {
  const includeCompleted = options?.includeCompleted ?? true;
  const includeDeleted = options?.includeDeleted ?? false;
  const sortField = options?.sortField ?? 'createdAt';
  const sortDirection = options?.sortDirection ?? SortDirectionEnum.ASC;

  let finalTasks = _databaseTasks.filter((task) => task.listId === listId);

  if (!includeCompleted) {
    finalTasks = finalTasks.filter((task) => !task.completedAt);
  }

  if (!includeDeleted) {
    finalTasks = finalTasks.filter((task) => !task.deletedAt);
  }

  finalTasks = finalTasks.sort((a, b) => {
    const field = sortField as keyof TaskInterface;
    const aValue = a[field]?.toString() ?? undefined;
    const bValue = b[field]?.toLocaleString() ?? undefined;

    if (typeof aValue !== 'undefined' && typeof bValue !== 'undefined') {
      if (sortField.endsWith('At')) {
        return sortDirection === SortDirectionEnum.ASC
          ? new Date(aValue).getTime() - new Date(bValue).getTime()
          : new Date(bValue).getTime() - new Date(aValue).getTime();
      }

      return sortDirection === SortDirectionEnum.ASC
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    return 0;
  });

  return finalTasks;
};

export const getTask = async (taskId: string): Promise<TaskInterface | null> => {
  return _databaseTasks.find((task) => task.id === taskId) ?? null;
};

export const addTask = async (task: OmitedTask): Promise<TaskInterface> => {
  const id = Date.now().toString();
  const createdAt = new Date().toISOString();
  const order = (await getTasksForList(task.listId)).length;
  const addedTask: TaskInterface = {
    ...task,
    id,
    order,
    createdAt,
    updatedAt: createdAt,
  };

  _databaseTasks.push(addedTask);

  return addedTask;
};

export const editTask = async (
  taskId: string,
  task: Partial<TaskInterface>
): Promise<TaskInterface> => {
  const taskIndex = _databaseTasks.findIndex((t) => t.id === taskId);
  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  const editedTask = {
    ..._databaseTasks[taskIndex],
    ...task,
    updatedAt: new Date().toISOString(),
  };

  _databaseTasks[taskIndex] = editedTask;

  return editedTask;
};

export const deleteTask = async (taskId: string): Promise<TaskInterface> => {
  return editTask(taskId, {
    deletedAt: new Date().toISOString(),
  });
};

export const reorderTask = async (
  originalTaskId: string,
  newTaskId: string,
  sortDirection: SortDirectionEnum
): Promise<TaskInterface[]> => {
  const originalTask = await getTask(originalTaskId);
  if (!originalTask) {
    throw new Error('Original task not found');
  }

  const newTask = await getTask(newTaskId);
  if (!newTask) {
    throw new Error('New task not found');
  }

  const tasks = await getTasksForList(originalTask.listId, {
    sortDirection,
    sortField: 'order',
  });

  const originalIndex = tasks.findIndex((task) => task.id === originalTaskId);
  const newIndex = tasks.findIndex((task) => task.id === newTaskId);

  const [movedTask] = tasks.splice(originalIndex, 1);
  tasks.splice(newIndex, 0, movedTask);

  if (sortDirection === SortDirectionEnum.ASC) {
    tasks.forEach((task, index) => {
      task.order = index;
    });
  } else {
    tasks.forEach((task, index) => {
      task.order = tasks.length - 1 - index;
    });
  }

  await Promise.all(tasks.map((task) => editTask(task.id, { order: task.order })));

  return tasks;
};

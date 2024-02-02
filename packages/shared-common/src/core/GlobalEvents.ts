import { List } from '../tasks/ListSchema';
import { Task } from '../tasks/TaskSchema';

export enum GlobalEventsEnum {
  // Tasks
  TASKS_TASK_ADDED = 'tasks:task:added',
  TASKS_TASK_EDITED = 'tasks:task:edited',
  TASKS_TASK_DELETED = 'tasks:task:deleted',
  TASKS_TASK_UNDELETED = 'tasks:task:undeleted',
  TASKS_TASK_COMPLETED = 'tasks:task:completed',
  TASKS_TASK_UNCOMPLETED = 'tasks:task:uncompleted',
  TASKS_TASK_DUPLICATED = 'tasks:task:duplicated',
  TASKS_REORDERED = 'tasks:reordered',
  // Lists
  LISTS_LIST_ADDED = 'lists:list:added',
  LISTS_LIST_EDITED = 'lists:list:edited',
  LISTS_LIST_DELETED = 'lists:list:deleted',
  LISTS_LIST_ADD_VISIBLE = 'lists:list:add-visible',
  LISTS_LIST_REMOVE_VISIBLE = 'lists:list:remove-visible',
}

export type GlobalEvents = {
  // Tasks
  [GlobalEventsEnum.TASKS_TASK_ADDED]: {
    userId: string; // Who did the action?
    taskId: string; // What task was added?
    listId: string | null; // What list was the task added to?
    teamId: string | null; // For what team was the task added (the teamId from the list)?
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_EDITED]: {
    userId: string;
    taskId: string;
    listId: string | null;
    teamId: string | null;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_DELETED]: {
    userId: string;
    taskId: string;
    listId: string | null;
    teamId: string | null;
    isHardDelete: boolean;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_UNDELETED]: {
    taskId: string;
    listId: string | null;
    teamId: string | null;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_COMPLETED]: {
    userId: string;
    taskId: string;
    listId: string | null;
    teamId: string | null;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_UNCOMPLETED]: {
    userId: string;
    taskId: string;
    listId: string | null;
    teamId: string | null;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_TASK_DUPLICATED]: {
    userId: string;
    taskId: string;
    listId: string | null;
    teamId: string | null;
    task?: Task;
  };
  [GlobalEventsEnum.TASKS_REORDERED]: {
    userId: string;
    listId: string | null;
    task?: Task;
  };
  // Lists
  [GlobalEventsEnum.LISTS_LIST_ADDED]: {
    userId: string;
    listId: string;
    list?: List;
  };
  [GlobalEventsEnum.LISTS_LIST_EDITED]: {
    userId: string;
    listId: string;
    list?: List;
  };
  [GlobalEventsEnum.LISTS_LIST_DELETED]: {
    userId: string;
    listId: string;
    list?: List;
  };
  [GlobalEventsEnum.LISTS_LIST_ADD_VISIBLE]: {
    userId: string;
    listId: string;
    list?: List;
  };
  [GlobalEventsEnum.LISTS_LIST_REMOVE_VISIBLE]: {
    userId: string;
    listId: string;
    list?: List;
  };
};

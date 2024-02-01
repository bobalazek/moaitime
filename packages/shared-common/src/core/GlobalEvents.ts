export enum GlobalEventsEnum {
  // Tasks
  TASK_ADDED = 'tasks:task:added',
  TASK_EDITED = 'tasks:task:edited',
  TASK_DELETED = 'tasks:task:deleted',
  TASK_UNDELETED = 'tasks:task:undeleted',
  TASK_COMPLETED = 'tasks:task:completed',
  TASK_UNCOMPLETED = 'tasks:task:uncompleted',
  TASK_DUPLICATED = 'tasks:task:duplicated',
  TASKS_REORDERED = 'tasks:tasks:reordered',
}

export type GlobalEvents = {
  // Tasks
  [GlobalEventsEnum.TASK_ADDED]: {
    userId: string; // Who did the action?
    taskId: string; // What task was added?
    listId: string | null; // What list was the task added to?
    teamId: string | null; // For what team was the task added (the teamId from the list)?
  };
  [GlobalEventsEnum.TASK_EDITED]: {
    userId: string;
    taskId: string;
    listId: string | null;
    teamId: string | null;
  };
  [GlobalEventsEnum.TASK_DELETED]: {
    userId: string;
    taskId: string;
    listId: string | null;
    teamId: string | null;
    isHardDelete: boolean;
  };
  [GlobalEventsEnum.TASK_UNDELETED]: {
    taskId: string;
    listId: string | null;
    teamId: string | null;
  };
  [GlobalEventsEnum.TASK_COMPLETED]: {
    userId: string;
    taskId: string;
    listId: string | null;
    teamId: string | null;
  };
  [GlobalEventsEnum.TASK_UNCOMPLETED]: {
    userId: string;
    taskId: string;
    listId: string | null;
    teamId: string | null;
  };
  [GlobalEventsEnum.TASK_DUPLICATED]: {
    userId: string;
    taskId: string;
    listId: string | null;
    teamId: string | null;
  };
  [GlobalEventsEnum.TASKS_REORDERED]: {
    userId: string;
    listId: string | null;
  };
};

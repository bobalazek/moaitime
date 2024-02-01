export enum GlobalEventsEnum {
  // Tasks
  TASK_ADDED = 'tasks:task:added',
  TASK_EDITED = 'tasks:task:edited',
  TASK_DELETED = 'tasks:task:deleted',
  TASK_UNDELETED = 'tasks:task:undeleted',
  TASK_COMPLETED = 'tasks:task:completed',
  TASK_UNCOMPLETED = 'tasks:task:uncompleted',
  TASK_DUPLICATED = 'tasks:task:duplicated',
}

export type GlobalEvents = {
  // Tasks
  [GlobalEventsEnum.TASK_ADDED]: {
    taskId: string;
    listId: string | null;
    teamId: string | null;
  };
  [GlobalEventsEnum.TASK_EDITED]: {
    taskId: string;
    listId: string | null;
    teamId: string | null;
  };
  [GlobalEventsEnum.TASK_DELETED]: {
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
    taskId: string;
    listId: string | null;
    teamId: string | null;
  };
  [GlobalEventsEnum.TASK_UNCOMPLETED]: {
    taskId: string;
    listId: string | null;
    teamId: string | null;
  };
  [GlobalEventsEnum.TASK_DUPLICATED]: {
    taskId: string;
    listId: string | null;
    teamId: string | null;
  };
};

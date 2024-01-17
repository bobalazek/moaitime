import mitt from 'mitt';

import { Task } from '@moaitime/shared-common';

export enum TasksEventsEnum {
  TASK_ADDED = 'tasks:task:added',
  TASK_EDITED = 'tasks:task:edited',
  TASK_DELETED = 'tasks:task:deleted',
  TASK_UNDELETED = 'tasks:task:undeleted',
  TASK_COMPLETED = 'tasks:task:completed',
  TASK_UNCOMPLETED = 'tasks:task:uncompleted',
  TASK_DUPLICATED = 'tasks:task:duplicated',
}

export type TasksEmitterEvents = {
  [TasksEventsEnum.TASK_ADDED]: { task: Task };
  [TasksEventsEnum.TASK_EDITED]: { task: Task };
  [TasksEventsEnum.TASK_DELETED]: { task: Task; isHardDelete: boolean };
  [TasksEventsEnum.TASK_UNDELETED]: { task: Task };
  [TasksEventsEnum.TASK_COMPLETED]: { task: Task };
  [TasksEventsEnum.TASK_UNCOMPLETED]: { task: Task };
  [TasksEventsEnum.TASK_DUPLICATED]: { task: Task };
};

export const tasksEmitter = mitt<TasksEmitterEvents>();

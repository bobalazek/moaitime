import mitt from 'mitt';

import { GlobalEventsEnum, Task } from '@moaitime/shared-common';

export type TasksEmitterEvents = {
  [GlobalEventsEnum.TASKS_TASK_ADDED]: { task: Task };
  [GlobalEventsEnum.TASKS_TASK_EDITED]: { task: Task };
  [GlobalEventsEnum.TASKS_TASK_DELETED]: { task: Task; isHardDelete: boolean };
  [GlobalEventsEnum.TASKS_TASK_UNDELETED]: { task: Task };
  [GlobalEventsEnum.TASKS_TASK_COMPLETED]: { task: Task };
  [GlobalEventsEnum.TASKS_TASK_UNCOMPLETED]: { task: Task };
  [GlobalEventsEnum.TASKS_TASK_DUPLICATED]: { task: Task };
};

export const tasksEmitter = mitt<TasksEmitterEvents>();

import { SortDirectionEnum } from '@myzenbuddy/shared-common';

export class ReorderTasksDto {
  listId!: string;
  originalTaskId!: string;
  newTaskId!: string;
  sortDirection!: SortDirectionEnum;
}

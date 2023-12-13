import { SortDirectionEnum } from '@moaitime/shared-common';

export class ReorderTasksDto {
  listId!: string;
  originalTaskId!: string;
  newTaskId!: string;
  sortDirection!: SortDirectionEnum;
}

import { SortDirectionEnum } from '@moaitime/shared-common';

export class ReorderTasksDto {
  listId!: string | null;
  originalTaskId!: string;
  newTaskId!: string;
  sortDirection!: SortDirectionEnum;
}

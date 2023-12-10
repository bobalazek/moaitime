export class CreateTaskDto {
  name!: string;
  order!: number;
  listId!: string;
  description?: string;
  priority?: number;
}

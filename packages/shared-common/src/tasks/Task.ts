export interface TaskInterface {
  id: string;
  name: string;
  order: number;
  description?: string;
  priority?: number;
  dueAt?: string;
  completedAt?: string;
  deletedAt?: string;
  createdAt: string;
  updatedAt: string;
  listId?: string;
}

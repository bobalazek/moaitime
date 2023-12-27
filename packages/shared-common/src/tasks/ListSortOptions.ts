export enum TasksListSortFieldEnum {
  ORDER = 'order',
  CREATED_AT = 'createdAt',
  NAME = 'name',
  COMPLETED_AT = 'completedAt',
  UPDATED_AT = 'updatedAt',
}

export const listSortOptions = [
  {
    label: 'Order',
    value: TasksListSortFieldEnum.ORDER,
  },
  {
    label: 'Created At',
    value: TasksListSortFieldEnum.CREATED_AT,
  },
  {
    label: 'Name',
    value: TasksListSortFieldEnum.NAME,
  },
  {
    label: 'Completed At',
    value: TasksListSortFieldEnum.COMPLETED_AT,
  },
  {
    label: 'Updated At',
    value: TasksListSortFieldEnum.UPDATED_AT,
  },
];

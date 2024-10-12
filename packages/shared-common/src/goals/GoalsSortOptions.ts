export enum GoalsListSortFieldEnum {
  NAME = 'name',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export const goalsSortOptions = [
  {
    label: 'Name',
    value: GoalsListSortFieldEnum.NAME,
  },
  {
    label: 'Created At',
    value: GoalsListSortFieldEnum.CREATED_AT,
  },
  {
    label: 'Updated At',
    value: GoalsListSortFieldEnum.UPDATED_AT,
  },
];

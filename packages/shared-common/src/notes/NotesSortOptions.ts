export enum NotesListSortFieldEnum {
  TITLE = 'title',
  CREATED_AT = 'createdAt',
  UPDATED_AT = 'updatedAt',
}

export const notesSortOptions = [
  {
    label: 'Title',
    value: NotesListSortFieldEnum.TITLE,
  },
  {
    label: 'Created At',
    value: NotesListSortFieldEnum.CREATED_AT,
  },
  {
    label: 'Updated At',
    value: NotesListSortFieldEnum.UPDATED_AT,
  },
];

import { FilePlusIcon, FilterIcon } from 'lucide-react';

import {
  NotesListSortFieldEnum,
  notesSortOptions,
  SortDirectionEnum,
} from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@moaitime/web-ui';

import { useNotesStore } from '../../../state/notesStore';

const NotesPageSidebarTopButtons = () => {
  const {
    notesSortField,
    notesSortDirection,
    notesSortIncludeDeleted,
    setDraftAsSelectedNoteData,
    setNotesSortField,
    setNotesSortDirection,
    setNotesSortIncludeDeleted,
  } = useNotesStore();

  const onAddNewNoteButtonClick = () => {
    setDraftAsSelectedNoteData();
  };

  return (
    <div className="mb-2 text-center text-xs">
      <button
        className="rounded-full p-1 hover:bg-gray-50 dark:hover:bg-gray-700"
        onClick={onAddNewNoteButtonClick}
        title="Add new note"
        data-test="notes--sidebar--add-new-note-button"
      >
        <FilePlusIcon size={20} />
      </button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full p-1 hover:bg-gray-50 dark:hover:bg-gray-700"
            title="Sort by"
            data-test="notes--sidebar--filters--dropdown-menu--trigger-button"
          >
            <FilterIcon size={20} />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" data-test="notes--sidebar--filters--dropdown-menu">
          <DropdownMenuLabel className="flex items-center justify-between">
            <span className="font-bold">Filters</span>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={notesSortField}
            onValueChange={(value) => {
              setNotesSortField(value as NotesListSortFieldEnum);
            }}
          >
            {notesSortOptions.map((sortOption) => (
              <DropdownMenuRadioItem
                key={sortOption.value}
                className="cursor-pointer"
                value={sortOption.value}
              >
                {sortOption.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={notesSortDirection}
            onValueChange={(value) => {
              setNotesSortDirection(value as SortDirectionEnum);
            }}
          >
            <DropdownMenuRadioItem className="cursor-pointer" value={SortDirectionEnum.ASC}>
              Ascending
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem className="cursor-pointer" value={SortDirectionEnum.DESC}>
              Descending
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={notesSortIncludeDeleted}
            onCheckedChange={setNotesSortIncludeDeleted}
          >
            Include deleted?
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default NotesPageSidebarTopButtons;

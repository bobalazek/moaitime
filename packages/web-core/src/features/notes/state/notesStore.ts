import { debounce } from 'lodash';
import { create } from 'zustand';

import {
  CreateNote,
  Note,
  NotesListSortFieldEnum,
  SortDirectionEnum,
  UpdateNote,
} from '@moaitime/shared-common';

import {
  addNote,
  deleteNote,
  editNote,
  getNote,
  loadNotes,
  undeleteNote,
} from '../utils/NoteHelpers';

export type NotesStore = {
  /********** Notes **********/
  notes: Note[];
  reloadNotes: () => Promise<Note[]>;
  getNote: (noteId: string) => Promise<Note>;
  addNote: (note: CreateNote) => Promise<Note>;
  editNote: (noteId: string, note: UpdateNote) => Promise<Note>;
  deleteNote: (noteId: string, isHardDelete?: boolean) => Promise<Note>;
  undeleteNote: (noteId: string) => Promise<Note>;
  // Sort
  notesSortField: NotesListSortFieldEnum;
  notesSortDirection: SortDirectionEnum;
  notesSortIncludeDeleted: boolean;
  setNotesSortField: (notesSortField: NotesListSortFieldEnum) => void;
  setNotesSortDirection: (notesSortDirection: SortDirectionEnum) => void;
  setNotesSortIncludeDeleted: (notesSortIncludeDeleted: boolean) => void;
  // Search
  notesSearch: string;
  setNotesSearch: (notesSearch: string) => Promise<string>;
  loadNotesDebounced: () => Promise<void>;
  // Selected
  selectedNote: Note | null;
  selectedNoteData: CreateNote | UpdateNote | null; // The cloned object of the selectedNote, so we don't mutate the original
  selectedNoteDataChanged: boolean;
  setSelectedNote: (note: Note | null, skipGet?: boolean) => Promise<Note | null>;
  setSelectedNoteData: (
    noteData: CreateNote | UpdateNote | null
  ) => Promise<CreateNote | UpdateNote | null>;
  saveSelectedNoteData: () => Promise<Note | null>;
  setDraftAsSelectedNoteData: () => Promise<CreateNote>;
};

export const useNotesStore = create<NotesStore>()((set, get) => ({
  /********** Notes **********/
  notes: [],
  reloadNotes: async () => {
    const { notesSearch, notesSortField, notesSortDirection, notesSortIncludeDeleted } = get();

    const notes = await loadNotes({
      search: notesSearch,
      sortField: notesSortField,
      sortDirection: notesSortDirection,
      includeDeleted: notesSortIncludeDeleted,
    });

    set({ notes });

    return notes;
  },
  getNote: async (noteId: string) => {
    const note = await getNote(noteId);

    return note;
  },
  addNote: async (note: CreateNote) => {
    const { reloadNotes, setSelectedNoteData } = get();
    const addedNote = await addNote(note);

    await reloadNotes();
    await setSelectedNoteData(addedNote);

    return addedNote;
  },
  editNote: async (noteId: string, note: UpdateNote) => {
    const { selectedNote, reloadNotes, setSelectedNote } = get();
    const editedNote = await editNote(noteId, note);

    await reloadNotes();

    if (selectedNote?.id === editedNote.id) {
      await setSelectedNote(editedNote, true);
    }

    return editedNote;
  },
  deleteNote: async (noteId: string, isHardDelete?: boolean) => {
    const { selectedNote, reloadNotes, setSelectedNote } = get();
    const deletedNote = await deleteNote(noteId, isHardDelete);

    await reloadNotes();

    await setSelectedNote(
      !isHardDelete && selectedNote?.id === deletedNote.id ? deletedNote : null,
      true
    );

    return deletedNote;
  },
  undeleteNote: async (noteId: string) => {
    const { selectedNote, reloadNotes, setSelectedNote } = get();
    const undeletedNote = await undeleteNote(noteId);

    await reloadNotes();

    if (selectedNote?.id === undeletedNote.id) {
      await setSelectedNote(undeletedNote, true);
    }

    return undeletedNote;
  },
  // Sort
  notesSortField: NotesListSortFieldEnum.CREATED_AT,
  notesSortDirection: SortDirectionEnum.DESC,
  notesSortIncludeDeleted: false,
  setNotesSortField: (notesSortField: NotesListSortFieldEnum) => {
    const { reloadNotes } = get();

    set({ notesSortField });

    reloadNotes();
  },
  setNotesSortDirection: (notesSortDirection: SortDirectionEnum) => {
    const { reloadNotes } = get();

    set({ notesSortDirection });

    reloadNotes();
  },
  setNotesSortIncludeDeleted: (notesSortIncludeDeleted: boolean) => {
    const { reloadNotes } = get();

    set({ notesSortIncludeDeleted });

    reloadNotes();
  },
  // Search
  notesSearch: '',
  setNotesSearch: async (notesSearch: string) => {
    const { loadNotesDebounced } = get();

    set({ notesSearch });

    loadNotesDebounced();

    return notesSearch;
  },
  loadNotesDebounced: (() => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let debouncedFn: any = null;

    return async () => {
      const { reloadNotes } = get();

      if (!debouncedFn) {
        debouncedFn = debounce(reloadNotes, 500);
      }

      debouncedFn();
    };
  })(),
  // Selected
  selectedNote: null,
  selectedNoteData: null,
  selectedNoteDataChanged: false,
  setSelectedNote: async (selectedNote: Note | null, skipGet?: boolean) => {
    const { getNote } = get();

    // The reason we get this is,
    // because that selected note most likely won't have the "content" field,
    // so we need to populate it here.
    const note = skipGet ? selectedNote : selectedNote ? await getNote(selectedNote.id) : null;

    set({
      selectedNote: note,
      selectedNoteData: note,
      selectedNoteDataChanged: false,
    });

    return note;
  },
  setSelectedNoteData: async (selectedNoteData: CreateNote | UpdateNote | null) => {
    set({
      selectedNoteData,
      selectedNoteDataChanged: !!selectedNoteData,
    });

    return selectedNoteData;
  },
  saveSelectedNoteData: async () => {
    const { selectedNote, selectedNoteData, editNote, addNote } = get();

    if (!selectedNoteData) {
      return null;
    }

    const savedNote = selectedNote
      ? await editNote(selectedNote.id, selectedNoteData)
      : await addNote(selectedNoteData as CreateNote);

    set({
      selectedNote: savedNote,
      selectedNoteDataChanged: false,
    });

    return savedNote;
  },
  setDraftAsSelectedNoteData: async () => {
    const selectedNoteData = {
      title: '',
    } as CreateNote;

    set({
      selectedNoteData,
      selectedNote: null,
      selectedNoteDataChanged: false,
    });

    return selectedNoteData;
  },
}));

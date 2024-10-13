import { debounce } from 'lodash';
import { create } from 'zustand';

import {
  CreateNote,
  GlobalEventsEnum,
  Note,
  NotesListSortFieldEnum,
  SortDirectionEnum,
  UpdateNote,
  UpdateNoteSchema,
} from '@moaitime/shared-common';

import { useAuthStore } from '../../auth/state/authStore';
import { useUserLimitsAndUsageStore } from '../../auth/state/userLimitsAndUsageStore';
import { globalEventsEmitter } from '../../core/state/globalEventsEmitter';
import {
  addNote,
  deleteNote,
  editNote,
  getNote,
  getNotes,
  undeleteNote,
} from '../utils/NoteHelpers';

export type NotesStore = {
  /********** Notes **********/
  notes: Note[];
  reloadNotes: () => Promise<Note[]>;
  reloadNotesDebounced: () => Promise<void>;
  getNote: (noteId: string) => Promise<Note>;
  addNote: (data: CreateNote) => Promise<Note>;
  editNote: (noteId: string, data: UpdateNote, skipSetSelectedNote?: boolean) => Promise<Note>;
  deleteNote: (noteId: string, isHardDelete?: boolean) => Promise<Note>;
  undeleteNote: (noteId: string) => Promise<Note>;
  shareNoteWithTeam: (noteId: string, teamId: string) => Promise<Note>;
  unshareNoteFromTeam: (noteId: string) => Promise<Note>;
  // Sort
  notesSortField: NotesListSortFieldEnum;
  notesSortDirection: SortDirectionEnum;
  notesIncludeDeleted: boolean;
  setNotesSortField: (notesSortField: NotesListSortFieldEnum) => void;
  setNotesSortDirection: (notesSortDirection: SortDirectionEnum) => void;
  setNotesIncludeDeleted: (notesIncludeDeleted: boolean) => void;
  // Search
  notesSearch: string;
  setNotesSearch: (notesSearch: string) => Promise<string>;
  // Selected
  selectedNote: Note | null;
  selectedNoteData: CreateNote | UpdateNote | null; // The cloned object of the selectedNote, so we don't mutate the original
  selectedNoteDataChanged: boolean;
  setSelectedNote: (
    note: (Note & { _forceReset?: boolean }) | null,
    skipGet?: boolean
  ) => Promise<Note | null>;
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
    const { notesSearch, notesSortField, notesSortDirection, notesIncludeDeleted } = get();

    const notes = await getNotes({
      search: notesSearch,
      sortField: notesSortField,
      sortDirection: notesSortDirection,
      includeDeleted: notesIncludeDeleted,
    });

    set({ notes });

    return notes;
  },
  reloadNotesDebounced: (() => {
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
  getNote: async (noteId: string) => {
    const note = await getNote(noteId);

    return note;
  },
  addNote: async (data: CreateNote) => {
    const { reloadNotes, setSelectedNoteData } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const addedNote = await addNote(data);

    globalEventsEmitter.emit(GlobalEventsEnum.NOTES_NOTE_ADDED, {
      actorUserId: addedNote.userId,
      noteId: addedNote.id,
    });

    await reloadNotes();
    await reloadUserUsage();
    await setSelectedNoteData(addedNote);

    return addedNote;
  },
  editNote: async (noteId: string, data: UpdateNote, skipSetSelectedNote?: boolean) => {
    const { selectedNote, reloadNotes, setSelectedNote } = get();

    const editedNote = await editNote(noteId, data);

    globalEventsEmitter.emit(GlobalEventsEnum.NOTES_NOTE_EDITED, {
      actorUserId: editedNote.userId,
      noteId: editedNote.id,
    });

    await reloadNotes();

    if (!skipSetSelectedNote && selectedNote?.id === editedNote.id) {
      await setSelectedNote(editedNote, true);
    }

    return editedNote;
  },
  deleteNote: async (noteId: string, isHardDelete?: boolean) => {
    const { selectedNote, reloadNotes, setSelectedNote } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const deletedNote = await deleteNote(noteId, isHardDelete);

    globalEventsEmitter.emit(GlobalEventsEnum.NOTES_NOTE_DELETED, {
      actorUserId: deletedNote.userId,
      noteId: deletedNote.id,
    });

    await reloadNotes();
    await reloadUserUsage();

    await setSelectedNote(
      !isHardDelete && selectedNote?.id === deletedNote.id ? deletedNote : null,
      true
    );

    return deletedNote;
  },
  undeleteNote: async (noteId: string) => {
    const { selectedNote, reloadNotes, setSelectedNote } = get();
    const { reloadUserUsage } = useUserLimitsAndUsageStore.getState();

    const undeletedNote = await undeleteNote(noteId);

    globalEventsEmitter.emit(GlobalEventsEnum.NOTES_NOTE_UNDELETED, {
      actorUserId: undeletedNote.userId,
      noteId: undeletedNote.id,
    });

    await reloadNotes();
    await reloadUserUsage();

    if (selectedNote?.id === undeletedNote.id) {
      await setSelectedNote(undeletedNote, true);
    }

    return undeletedNote;
  },
  shareNoteWithTeam: async (noteId: string, teamId: string) => {
    const { editNote } = get();

    const editedNote = await editNote(noteId, {
      teamId,
    });

    return editedNote;
  },
  unshareNoteFromTeam: async (noteId: string) => {
    const { editNote, setSelectedNote } = get();
    const { auth } = useAuthStore.getState();

    const editedNote = await editNote(
      noteId,
      {
        teamId: null,
      },
      true
    );

    // We skip the set above and only set the selected note if it's the user that created it
    if (editedNote.userId === auth?.user.id) {
      await setSelectedNote(editedNote, true);
    } else {
      await setSelectedNote(null);
    }

    return editedNote;
  },
  // Sort
  notesSortField: NotesListSortFieldEnum.CREATED_AT,
  notesSortDirection: SortDirectionEnum.DESC,
  notesIncludeDeleted: false,
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
  setNotesIncludeDeleted: (notesIncludeDeleted: boolean) => {
    const { reloadNotes } = get();

    set({ notesIncludeDeleted });

    reloadNotes();
  },
  // Search
  notesSearch: '',
  setNotesSearch: async (notesSearch: string) => {
    const { reloadNotesDebounced } = get();

    set({ notesSearch });

    reloadNotesDebounced();

    return notesSearch;
  },
  // Selected
  selectedNote: null,
  selectedNoteData: null,
  selectedNoteDataChanged: false,
  setSelectedNote: async (
    newSelectedNote: (Note & { _forceReset?: boolean }) | null,
    skipGet?: boolean
  ) => {
    const { getNote, selectedNote, selectedNoteData, selectedNoteDataChanged, editNote } = get();

    // If we navigate away without saving, we want to save the changes
    if (selectedNoteDataChanged && selectedNote && selectedNote.id !== newSelectedNote?.id) {
      await editNote(selectedNote.id, selectedNoteData as UpdateNote);
    }

    // The reason we get this is,
    // because that selected note most likely won't have the "content" field,
    // so we need to populate it here.
    const note = skipGet
      ? newSelectedNote
      : newSelectedNote
        ? ((await getNote(newSelectedNote.id)) as Note)
        : null;

    // We need this hack to reload the note editor with new value
    if (note && newSelectedNote?._forceReset) {
      (note as Note & { _forceReset?: boolean })._forceReset = true;
    }

    let newSelectedNoteData: UpdateNote | null = null;
    if (note) {
      try {
        const parsedNote = UpdateNoteSchema.parse(note);

        newSelectedNoteData = parsedNote;
      } catch (e) {
        newSelectedNoteData = {
          title: note?.title ?? '',
          content: note?.content as never,
          color: note?.color,
          directory: note?.directory,
        };
      }
    }

    set({
      selectedNote: note,
      selectedNoteData: newSelectedNoteData,
      selectedNoteDataChanged: false,
    });

    return note;
  },
  setSelectedNoteData: async (selectedNoteData: Note | CreateNote | UpdateNote | null) => {
    try {
      const parsedNote = UpdateNoteSchema.parse(selectedNoteData);

      selectedNoteData = parsedNote;
    } catch (e) {
      selectedNoteData = selectedNoteData as UpdateNote;
    }

    set({
      selectedNoteData,
      selectedNoteDataChanged: !!selectedNoteData,
    });

    return selectedNoteData;
  },
  saveSelectedNoteData: async () => {
    const { selectedNote, selectedNoteData, selectedNoteDataChanged, editNote, addNote } = get();

    if (!selectedNoteData || !selectedNoteDataChanged) {
      return null;
    }

    const savedNote = selectedNote?.id
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

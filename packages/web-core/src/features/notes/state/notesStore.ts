import { create } from 'zustand';

import { CreateNote, Note, UpdateNote } from '@moaitime/shared-common';

import { addNote, editNote, loadNotes } from '../utils/NotesHelpers';

export type NotesStore = {
  /********** Notes **********/
  notes: Note[];
  loadNotes: () => Promise<Note[]>;
  addNote: (note: CreateNote) => Promise<Note>;
  editNote: (noteId: string, note: UpdateNote) => Promise<Note>;
  // Selected
  selectedNote: Note | null;
  selectedNoteData: CreateNote | UpdateNote | null; // The cloned object of the selectedNote, so we don't mutate the original
  setSelectedNote: (note: Note | null) => Promise<Note | null>;
  setSelectedNoteData: (
    noteData: CreateNote | UpdateNote | null
  ) => Promise<CreateNote | UpdateNote | null>;
  saveSelectedNoteData: () => Promise<Note | null>;
  setDraftAsSelectedNoteData: () => Promise<CreateNote>;
};

export const useNotesStore = create<NotesStore>()((set, get) => ({
  /********** Notes **********/
  notes: [],
  loadNotes: async () => {
    const notes = await loadNotes();

    set({ notes });

    return notes;
  },
  addNote: async (note: CreateNote) => {
    const { loadNotes, setSelectedNoteData } = get();
    const addedNote = await addNote(note);

    await loadNotes();
    await setSelectedNoteData(addedNote);

    return addedNote;
  },
  editNote: async (noteId: string, note: UpdateNote) => {
    const { loadNotes } = get();
    const editedNote = await editNote(noteId, note);

    await loadNotes();

    return editedNote;
  },
  // Selected
  selectedNote: null,
  selectedNoteData: null,
  setSelectedNote: async (selectedNote: Note | null) => {
    set({ selectedNote });

    return selectedNote;
  },
  setSelectedNoteData: async (selectedNoteData: CreateNote | UpdateNote | null) => {
    set({ selectedNoteData });

    return selectedNoteData;
  },
  saveSelectedNoteData: async () => {
    const { selectedNoteData } = get();

    if (!selectedNoteData) {
      return null;
    }

    // TODO

    return null;
  },
  setDraftAsSelectedNoteData: async () => {
    const selectedNoteData = {
      id: '',
      title: '',
    } as CreateNote;

    set({ selectedNoteData });

    return selectedNoteData;
  },
}));

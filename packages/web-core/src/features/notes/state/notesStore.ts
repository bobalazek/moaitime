import { create } from 'zustand';

import { CreateNote, Note, UpdateNote } from '@moaitime/shared-common';

import { addNote, deleteNote, editNote, getNote, loadNotes } from '../utils/NotesHelpers';

export type NotesStore = {
  /********** Notes **********/
  notes: Note[];
  loadNotes: () => Promise<Note[]>;
  getNote: (noteId: string) => Promise<Note>;
  addNote: (note: CreateNote) => Promise<Note>;
  editNote: (noteId: string, note: UpdateNote) => Promise<Note>;
  deleteNote: (noteId: string) => Promise<Note>;
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
  getNote: async (noteId: string) => {
    const note = await getNote(noteId);

    return note;
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
  deleteNote: async (noteId: string) => {
    const { loadNotes, setSelectedNote } = get();
    const deletedNote = await deleteNote(noteId);

    setSelectedNote(null);

    await loadNotes();

    return deletedNote;
  },
  // Selected
  selectedNote: null,
  selectedNoteData: null,
  setSelectedNote: async (selectedNote: Note | null) => {
    set({
      selectedNote,
      selectedNoteData: selectedNote,
    });

    return selectedNote;
  },
  setSelectedNoteData: async (selectedNoteData: CreateNote | UpdateNote | null) => {
    set({ selectedNoteData });

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

    set({ selectedNote: savedNote });

    return savedNote;
  },
  setDraftAsSelectedNoteData: async () => {
    const selectedNoteData = {
      title: '',
    } as CreateNote;

    set({ selectedNoteData });

    return selectedNoteData;
  },
}));

import { create } from 'zustand';

import { Note } from '@moaitime/shared-common';

import { loadNotes } from '../utils/NotesHelpers';

export type NotesStore = {
  /********** Notes **********/
  notes: Note[];
  loadNotes: () => Promise<Note[]>;
  // Selected
  selectedNote: Note | null;
  setSelectedNote: (note: Note | null) => Promise<Note | null>;
  setDraftAsSelectedNote: () => Promise<Note>;
};

export const useNotesStore = create<NotesStore>()((set) => ({
  /********** Notes **********/
  notes: [],
  loadNotes: async () => {
    const notes = await loadNotes();

    set({ notes });

    return notes;
  },
  // Selected
  selectedNote: null,
  setSelectedNote: async (selectedNote: Note | null) => {
    set({ selectedNote });

    return selectedNote;
  },
  setDraftAsSelectedNote: async () => {
    const nowDate = new Date().toISOString();
    const selectedNoteDraft = {
      id: '',
      title: '',
      content: '',
      color: null,
      directory: null,
      deletedAt: null,
      createdAt: nowDate,
      updatedAt: nowDate,
      userId: '',
    };

    set({ selectedNote: selectedNoteDraft });

    return selectedNoteDraft;
  },
}));

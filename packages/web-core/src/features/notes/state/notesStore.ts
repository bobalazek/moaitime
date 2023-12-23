import { create } from 'zustand';

import { Note } from '@moaitime/shared-common';

import { loadNotes } from '../utils/NotesHelpers';

export type NotesStore = {
  /********** Notes **********/
  notes: Note[];
  loadNotes: () => Promise<Note[]>;
};

export const useNotesStore = create<NotesStore>()((set) => ({
  /********** Notes **********/
  notes: [],
  loadNotes: async () => {
    const notes = await loadNotes();

    set({ notes });

    return notes;
  },
}));

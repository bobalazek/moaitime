import { create } from 'zustand';

import { CreateFeedbackEntry, FeedbackEntry } from '@moaitime/shared-common';

import { addFeedbackEntry } from '../utils/FeedbackHelpers';

export type SettingsStore = {
  dialogOpen: boolean;
  setDialogOpen: (dialogOpen: boolean) => void;
  addFeedbackEntry: (data: CreateFeedbackEntry) => Promise<FeedbackEntry>;
};

export const useSettingsStore = create<SettingsStore>()((set) => ({
  dialogOpen: false,
  setDialogOpen: (dialogOpen: boolean) => {
    set({
      dialogOpen,
    });
  },
  addFeedbackEntry: (data: CreateFeedbackEntry) => {
    const feedbackEntry = addFeedbackEntry(data);

    return feedbackEntry;
  },
}));

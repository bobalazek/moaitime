import { create } from 'zustand';

import {
  CreateMoodEntry,
  GlobalEventsEnum,
  MoodEntry,
  UpdateMoodEntry,
} from '@moaitime/shared-common';

import { globalEventsEmitter } from '../../core/state/globalEventsEmitter';
import {
  addMoodEntry,
  deleteMoodEntry,
  editMoodEntry,
  getMoodEntry,
  undeleteMoodEntry,
} from '../utils/MoodHelpers';

export type MoodEntrieStore = {
  /********** Mood Entries **********/
  getMoodEntry: (moodEntryId: string) => Promise<MoodEntry>;
  addMoodEntry: (moodEntry: CreateMoodEntry) => Promise<MoodEntry>;
  editMoodEntry: (moodEntryId: string, moodEntry: UpdateMoodEntry) => Promise<MoodEntry>;
  deleteMoodEntry: (moodEntryId: string, isHardDelete?: boolean) => Promise<MoodEntry>;
  undeleteMoodEntry: (moodEntryId: string) => Promise<MoodEntry>;
  // Selected Mood Entry Dialog
  selectedMoodEntryDialogOpen: boolean;
  selectedMoodEntryDialog: MoodEntry | null;
  setSelectedMoodEntryDialogOpen: (
    selectedMoodEntryDialogOpen: boolean,
    selectedMoodEntryDialog?: MoodEntry | null
  ) => void;
};

export const useMoodEntriesStore = create<MoodEntrieStore>()((set) => ({
  /********** Mood Entries **********/
  getMoodEntry: async (moodEntryId: string) => {
    const moodentry = await getMoodEntry(moodEntryId);

    return moodentry;
  },
  addMoodEntry: async (moodEntry: CreateMoodEntry) => {
    const addedMoodEntry = await addMoodEntry(moodEntry);

    globalEventsEmitter.emit(GlobalEventsEnum.MOOD_MOOD_ENTRY_ADDED, { moodEntry: addedMoodEntry });

    return addedMoodEntry;
  },
  editMoodEntry: async (moodEntryId: string, moodEntry: UpdateMoodEntry) => {
    const editedMoodEntry = await editMoodEntry(moodEntryId, moodEntry);

    globalEventsEmitter.emit(GlobalEventsEnum.MOOD_MOOD_ENTRY_EDITED, {
      moodEntry: editedMoodEntry,
    });

    return editedMoodEntry;
  },
  deleteMoodEntry: async (moodEntryId: string, isHardDelete?: boolean) => {
    const deletedMoodEntry = await deleteMoodEntry(moodEntryId, isHardDelete);

    globalEventsEmitter.emit(GlobalEventsEnum.MOOD_MOOD_ENTRY_DELETED, {
      moodEntry: deletedMoodEntry,
      isHardDelete: !!isHardDelete,
    });

    return deletedMoodEntry;
  },
  undeleteMoodEntry: async (moodEntryId: string) => {
    const undeletedMoodEntry = await undeleteMoodEntry(moodEntryId);

    globalEventsEmitter.emit(GlobalEventsEnum.MOOD_MOOD_ENTRY_UNDELETED, {
      moodEntry: undeletedMoodEntry,
    });

    return undeletedMoodEntry;
  },
  // Selected Mood Entry Dialog
  selectedMoodEntryDialogOpen: false,
  selectedMoodEntryDialog: null,
  setSelectedMoodEntryDialogOpen: (
    selectedMoodEntryDialogOpen: boolean,
    selectedMoodEntryDialog?: MoodEntry | null
  ) => {
    set({
      selectedMoodEntryDialogOpen,
      selectedMoodEntryDialog,
    });
  },
}));

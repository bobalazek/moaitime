import { create } from 'zustand';

import { CreateMoodEntry, MoodEntry, UpdateMoodEntry } from '@moaitime/shared-common';

import { queryClient } from '../../core/utils/FetchHelpers';
import { MOOD_ENTRIES_QUERY_KEY } from '../hooks/useMoodEntriesQuery';
import {
  addMoodEntry,
  deleteMoodEntry,
  editMoodEntry,
  getMoodEntry,
  undeleteMoodEntry,
} from '../utils/MoodHelpers';

export type MoodEntrieStore = {
  /********** Mood Entries **********/
  getMoodEntry: (moodentryId: string) => Promise<MoodEntry>;
  addMoodEntry: (moodentry: CreateMoodEntry) => Promise<MoodEntry>;
  editMoodEntry: (moodentryId: string, moodentry: UpdateMoodEntry) => Promise<MoodEntry>;
  deleteMoodEntry: (moodentryId: string, isHardDelete?: boolean) => Promise<MoodEntry>;
  undeleteMoodEntry: (moodentryId: string) => Promise<MoodEntry>;
  // Selected Mood Entry Dialog
  selectedMoodEntryDialogOpen: boolean;
  selectedMoodEntryDialog: MoodEntry | null;
  setSelectedMoodEntryDialogOpen: (
    selectedMoodEntryDialogOpen: boolean,
    selectedMoodEntryDialog?: MoodEntry | null
  ) => void;
};

const reloadMoodEntries = async () => {
  return queryClient.invalidateQueries([MOOD_ENTRIES_QUERY_KEY]);
};

export const useMoodEntrysStore = create<MoodEntrieStore>()((set) => ({
  /********** Mood Entries **********/
  getMoodEntry: async (moodentryId: string) => {
    const moodentry = await getMoodEntry(moodentryId);

    return moodentry;
  },
  addMoodEntry: async (moodentry: CreateMoodEntry) => {
    const addedMoodEntry = await addMoodEntry(moodentry);

    await reloadMoodEntries();

    return addedMoodEntry;
  },
  editMoodEntry: async (moodentryId: string, moodentry: UpdateMoodEntry) => {
    const editedMoodEntry = await editMoodEntry(moodentryId, moodentry);

    await reloadMoodEntries();

    return editedMoodEntry;
  },
  deleteMoodEntry: async (moodentryId: string, isHardDelete?: boolean) => {
    const deletedMoodEntry = await deleteMoodEntry(moodentryId, isHardDelete);

    await reloadMoodEntries();

    return deletedMoodEntry;
  },
  undeleteMoodEntry: async (moodentryId: string) => {
    const undeletedMoodEntry = await undeleteMoodEntry(moodentryId);

    await reloadMoodEntries();

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

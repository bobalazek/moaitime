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
import { moodEntriesEmitter, MoodEntriesEventsEnum } from './moodEntriesEmitter';

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

const reloadMoodEntries = async () => {
  return queryClient.invalidateQueries([MOOD_ENTRIES_QUERY_KEY]);
};

export const useMoodEntriesStore = create<MoodEntrieStore>()((set) => ({
  /********** Mood Entries **********/
  getMoodEntry: async (moodEntryId: string) => {
    const moodentry = await getMoodEntry(moodEntryId);

    return moodentry;
  },
  addMoodEntry: async (moodEntry: CreateMoodEntry) => {
    const addedMoodEntry = await addMoodEntry(moodEntry);

    await reloadMoodEntries();

    moodEntriesEmitter.emit(MoodEntriesEventsEnum.MOOD_ENTRY_ADDED, { moodEntry: addedMoodEntry });

    return addedMoodEntry;
  },
  editMoodEntry: async (moodEntryId: string, moodEntry: UpdateMoodEntry) => {
    const editedMoodEntry = await editMoodEntry(moodEntryId, moodEntry);

    await reloadMoodEntries();

    moodEntriesEmitter.emit(MoodEntriesEventsEnum.MOOD_ENTRY_EDITED, {
      moodEntry: editedMoodEntry,
    });

    return editedMoodEntry;
  },
  deleteMoodEntry: async (moodEntryId: string, isHardDelete?: boolean) => {
    const deletedMoodEntry = await deleteMoodEntry(moodEntryId, isHardDelete);

    await reloadMoodEntries();

    moodEntriesEmitter.emit(MoodEntriesEventsEnum.MOOD_ENTRY_DELETED, {
      moodEntry: deletedMoodEntry,
      isHardDelete: !!isHardDelete,
    });

    return deletedMoodEntry;
  },
  undeleteMoodEntry: async (moodEntryId: string) => {
    const undeletedMoodEntry = await undeleteMoodEntry(moodEntryId);

    await reloadMoodEntries();

    moodEntriesEmitter.emit(MoodEntriesEventsEnum.MOOD_ENTRY_UNDELETED, {
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

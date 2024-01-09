import { create } from 'zustand';

import { CreateMoodEntry, MoodEntry, UpdateMoodEntry } from '@moaitime/shared-common';

import {
  addMoodEntry,
  deleteMoodEntry,
  editMoodEntry,
  getMoodEntry,
  loadMoodEntries,
  undeleteMoodEntry,
} from '../utils/MoodHelpers';

export type MoodEntrieStore = {
  /********** Mood Entries **********/
  moodEntries: MoodEntry[];
  reloadMoodEntries: () => Promise<MoodEntry[]>;
  getMoodEntry: (moodentryId: string) => Promise<MoodEntry>;
  addMoodEntry: (moodentry: CreateMoodEntry) => Promise<MoodEntry>;
  editMoodEntry: (moodentryId: string, moodentry: UpdateMoodEntry) => Promise<MoodEntry>;
  deleteMoodEntry: (moodentryId: string, isHardDelete?: boolean) => Promise<MoodEntry>;
  undeleteMoodEntry: (moodentryId: string) => Promise<MoodEntry>;
  // Selected
  selectedMoodEntry: MoodEntry | null;
  selectedMoodEntryData: CreateMoodEntry | UpdateMoodEntry | null; // The cloned object of the selectedMoodEntry, so we don't mutate the original
  selectedMoodEntryDataChanged: boolean;
  setSelectedMoodEntry: (
    moodentry: MoodEntry | null,
    skipGet?: boolean
  ) => Promise<MoodEntry | null>;
  setSelectedMoodEntryData: (
    moodentryData: CreateMoodEntry | UpdateMoodEntry | null
  ) => Promise<CreateMoodEntry | UpdateMoodEntry | null>;
  saveSelectedMoodEntryData: () => Promise<MoodEntry | null>;
};

export const useMoodEntrysStore = create<MoodEntrieStore>()((set, get) => ({
  /********** MoodEntrys **********/
  moodEntries: [],
  reloadMoodEntries: async () => {
    const moodEntries = await loadMoodEntries();

    set({ moodEntries });

    return moodEntries;
  },
  getMoodEntry: async (moodentryId: string) => {
    const moodentry = await getMoodEntry(moodentryId);

    return moodentry;
  },
  addMoodEntry: async (moodentry: CreateMoodEntry) => {
    const { reloadMoodEntries, setSelectedMoodEntryData } = get();
    const addedMoodEntry = await addMoodEntry(moodentry);

    await reloadMoodEntries();
    await setSelectedMoodEntryData(addedMoodEntry);

    return addedMoodEntry;
  },
  editMoodEntry: async (moodentryId: string, moodentry: UpdateMoodEntry) => {
    const { selectedMoodEntry, reloadMoodEntries, setSelectedMoodEntry } = get();
    const editedMoodEntry = await editMoodEntry(moodentryId, moodentry);

    await reloadMoodEntries();

    if (selectedMoodEntry?.id === editedMoodEntry.id) {
      await setSelectedMoodEntry(editedMoodEntry, true);
    }

    return editedMoodEntry;
  },
  deleteMoodEntry: async (moodentryId: string, isHardDelete?: boolean) => {
    const { selectedMoodEntry, reloadMoodEntries, setSelectedMoodEntry } = get();
    const deletedMoodEntry = await deleteMoodEntry(moodentryId, isHardDelete);

    await reloadMoodEntries();

    await setSelectedMoodEntry(
      !isHardDelete && selectedMoodEntry?.id === deletedMoodEntry.id ? deletedMoodEntry : null,
      true
    );

    return deletedMoodEntry;
  },
  undeleteMoodEntry: async (moodentryId: string) => {
    const { selectedMoodEntry, reloadMoodEntries, setSelectedMoodEntry } = get();
    const undeletedMoodEntry = await undeleteMoodEntry(moodentryId);

    await reloadMoodEntries();

    if (selectedMoodEntry?.id === undeletedMoodEntry.id) {
      await setSelectedMoodEntry(undeletedMoodEntry, true);
    }

    return undeletedMoodEntry;
  },
  // Selected
  selectedMoodEntry: null,
  selectedMoodEntryData: null,
  selectedMoodEntryDataChanged: false,
  setSelectedMoodEntry: async (selectedMoodEntry: MoodEntry | null, skipGet?: boolean) => {
    const { getMoodEntry } = get();

    // The reason we get this is,
    // because that selected moodentry most likely won't have the "content" field,
    // so we need to populate it here.
    const moodentry = skipGet
      ? selectedMoodEntry
      : selectedMoodEntry
        ? await getMoodEntry(selectedMoodEntry.id)
        : null;

    set({
      selectedMoodEntry: moodentry,
      selectedMoodEntryData: moodentry,
      selectedMoodEntryDataChanged: false,
    });

    return moodentry;
  },
  setSelectedMoodEntryData: async (
    selectedMoodEntryData: CreateMoodEntry | UpdateMoodEntry | null
  ) => {
    set({
      selectedMoodEntryData,
      selectedMoodEntryDataChanged: !!selectedMoodEntryData,
    });

    return selectedMoodEntryData;
  },
  saveSelectedMoodEntryData: async () => {
    const { selectedMoodEntry, selectedMoodEntryData, editMoodEntry, addMoodEntry } = get();

    if (!selectedMoodEntryData) {
      return null;
    }

    const savedMoodEntry = selectedMoodEntry
      ? await editMoodEntry(selectedMoodEntry.id, selectedMoodEntryData)
      : await addMoodEntry(selectedMoodEntryData as CreateMoodEntry);

    set({
      selectedMoodEntry: savedMoodEntry,
      selectedMoodEntryDataChanged: false,
    });

    return savedMoodEntry;
  },
}));

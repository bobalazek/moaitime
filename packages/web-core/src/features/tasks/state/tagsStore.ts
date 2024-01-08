import { create } from 'zustand';

import { CreateTag, Tag, UpdateTag } from '@moaitime/shared-common';

import { addTag, deleteTag, editTag, loadTags, undeleteTag } from '../utils/TagHelpers';

export type TagsStore = {
  /********** General **********/
  tagsDialogOpen: boolean;
  setTagsDialogOpen: (tagsDialogOpen: boolean) => Promise<void>;
  tagsDialogTags: Tag[]; // The reason we have separate tags here is, because we want to get all (including deleted) tags here
  reloadDialogTags: () => Promise<Tag[]>;
  /********** Tags **********/
  tags: Tag[];
  reloadTags: () => Promise<Tag[]>;
  addTag: (tag: CreateTag) => Promise<Tag>;
  editTag: (tagId: string, tag: UpdateTag) => Promise<Tag>;
  deleteTag: (tagId: string, isHardDelete?: boolean) => Promise<Tag>;
  undeleteTag: (tagId: string) => Promise<Tag>;
  // Selected Tag Dialog
  selectedTagDialogOpen: boolean;
  selectedTagDialog: Tag | null;
  setSelectedTagDialogOpen: (
    selectedTagDialogOpen: boolean,
    selectedTagDialog?: Tag | null
  ) => void;
};

export const useTagsStore = create<TagsStore>()((set, get) => ({
  /********** General **********/
  tagsDialogOpen: false,
  setTagsDialogOpen: async (tagsDialogOpen: boolean) => {
    const { reloadDialogTags } = get();

    set({
      tagsDialogOpen,
    });

    await reloadDialogTags();
  },
  tagsDialogTags: [],
  reloadDialogTags: async () => {
    const { tagsDialogOpen } = get();

    if (!tagsDialogOpen) {
      return [];
    }

    const tagsDialogTags = await loadTags({ includeDeleted: true });

    set({
      tagsDialogTags,
    });

    return tagsDialogTags;
  },
  /********** Tags **********/
  tags: [],
  reloadTags: async () => {
    const tags = await loadTags();

    set({
      tags,
    });

    return tags;
  },
  addTag: async (tag: CreateTag) => {
    const { reloadTags, reloadDialogTags } = get();

    const addedTag = await addTag(tag);

    await reloadTags();
    await reloadDialogTags();

    return addedTag;
  },
  editTag: async (tagId: string, tag: UpdateTag) => {
    const { reloadTags, reloadDialogTags } = get();

    const editedTag = await editTag(tagId, tag);

    await reloadTags();
    await reloadDialogTags();

    return editedTag;
  },
  deleteTag: async (tagId: string, isHardDelete?: boolean) => {
    const { reloadTags, reloadDialogTags } = get();

    const deletedTag = await deleteTag(tagId, isHardDelete);

    await reloadTags();
    await reloadDialogTags();

    return deletedTag;
  },
  undeleteTag: async (tagId: string) => {
    const { reloadTags, reloadDialogTags } = get();

    const undeletedTag = await undeleteTag(tagId);

    await reloadTags();
    await reloadDialogTags();

    return undeletedTag;
  },
  // Selected Tag Dialog
  selectedTagDialogOpen: false,
  selectedTagDialog: null,
  setSelectedTagDialogOpen: (selectedTagDialogOpen: boolean, selectedTagDialog?: Tag | null) => {
    set({
      selectedTagDialogOpen,
      selectedTagDialog,
    });
  },
}));

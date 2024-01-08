import { create } from 'zustand';

import { CreateTag, Tag, UpdateTag } from '@moaitime/shared-common';

import { addTag, deleteTag, editTag, loadTags, undeleteTag } from '../utils/TagHelpers';

export type TagsStore = {
  /********** General **********/
  tagsDialogOpen: boolean;
  setTagsDialogOpen: (tagsDialogOpen: boolean) => void;
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
  setTagsDialogOpen: (tagsDialogOpen: boolean) => {
    set({
      tagsDialogOpen,
    });
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
    const { reloadTags } = get();

    const addedTag = await addTag(tag);

    await reloadTags();

    return addedTag;
  },
  editTag: async (tagId: string, tag: UpdateTag) => {
    const { reloadTags } = get();

    const editedTag = await editTag(tagId, tag);

    await reloadTags();

    return editedTag;
  },
  deleteTag: async (tagId: string, isHardDelete?: boolean) => {
    const { reloadTags } = get();

    const deletedTag = await deleteTag(tagId, isHardDelete);

    await reloadTags();

    return deletedTag;
  },
  undeleteTag: async (tagId: string) => {
    const { reloadTags } = get();

    const undeletedTag = await undeleteTag(tagId);

    await reloadTags();

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

import { create } from 'zustand';

import { CreateTag, Tag } from '@moaitime/shared-common';

import { addTag, loadTags } from '../utils/TagHelpers';

export type TagsStore = {
  /********** Tags **********/
  tags: Tag[];
  reloadTags: () => Promise<Tag[]>;
  addTag: (tag: CreateTag) => Promise<Tag>;
};

export const useTagsStore = create<TagsStore>()((set, get) => ({
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

    const addedTask = await addTag(tag);

    await reloadTags();

    return addedTask;
  },
}));

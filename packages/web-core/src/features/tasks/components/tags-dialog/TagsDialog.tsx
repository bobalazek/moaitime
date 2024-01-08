import { PlusIcon } from 'lucide-react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@moaitime/web-ui';

import { useTagsStore } from '../../../tasks/state/tagsStore';
import TagItem from '../tags/TagItem';

export default function TagsDialog() {
  const { tags, tagsDialogOpen, setTagsDialogOpen, setSelectedTagDialogOpen } = useTagsStore();

  return (
    <Dialog open={tagsDialogOpen} onOpenChange={setTagsDialogOpen}>
      <DialogContent data-test="tasks--tags-dialog">
        <DialogHeader>
          <DialogTitle className="flex items-center align-middle">
            <span>Tags</span>
            <button
              type="button"
              className="ml-2 cursor-pointer rounded-full p-[4px] hover:bg-gray-50 dark:hover:bg-gray-800"
              data-test="tasks--tags-dialog--add-new-button"
              onClick={() => {
                setSelectedTagDialogOpen(true, null);
              }}
              title="Add new tag"
            >
              <PlusIcon className="h-4 w-4" />
            </button>
          </DialogTitle>
        </DialogHeader>
        <div>
          {tags.length === 0 && (
            <div className="flex flex-col items-center justify-center p-4">
              <div className="text-center">
                <div className="text-xl">No tags yet</div>
              </div>
            </div>
          )}
          {tags.map((tag) => (
            <TagItem key={tag.id} tag={tag} />
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

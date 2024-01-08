import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@moaitime/web-ui';

import { useTagsStore } from '../../../tasks/state/tagsStore';
import TagItem from '../tags/TagItem';

export default function TagsDialog() {
  const { tags, tagsDialogOpen, setTagsDialogOpen } = useTagsStore();

  return (
    <Dialog open={tagsDialogOpen} onOpenChange={setTagsDialogOpen}>
      <DialogContent data-test="tasks--tags-dialog">
        <DialogHeader>
          <DialogTitle>Tags</DialogTitle>
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

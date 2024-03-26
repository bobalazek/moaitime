import { Dialog, DialogContent, DialogHeader, DialogTitle, ScrollArea } from '@moaitime/web-ui';

import { useListsStore } from '../../state/listsStore';
import ListItem from '../list-item/ListItem';

export default function DeletedListsDialog() {
  const { deletedLists, deletedListsDialogOpen, setDeletedListsDialogOpen } = useListsStore();

  return (
    <Dialog open={deletedListsDialogOpen} onOpenChange={setDeletedListsDialogOpen}>
      <DialogContent data-test="lists--deleted-lists-dialog">
        <DialogHeader>
          <DialogTitle>Deleted Lists</DialogTitle>
        </DialogHeader>
        {deletedLists.length === 0 && (
          <div className="flex flex-col items-center justify-center p-4">
            <div className="text-muted-foreground text-center">No deleted lists</div>
          </div>
        )}
        {deletedLists.length > 0 && (
          <ScrollArea>
            {deletedLists.map((list) => (
              <ListItem key={list.id} list={list} />
            ))}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

import { MoreVerticalIcon, PencilIcon, TrashIcon } from 'lucide-react';
import { memo, useState } from 'react';

import { Tag } from '@moaitime/shared-common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  sonnerToast,
} from '@moaitime/web-ui';

import { useTagsStore } from '../../state/tagsStore';

const TagItemActions = memo(({ tag }: { tag: Tag }) => {
  const { setSelectedTagDialogOpen, deleteTag, undeleteTag } = useTagsStore();
  const [open, setOpen] = useState(false);

  const onEditButtonClick = async () => {
    setSelectedTagDialogOpen(true, tag);

    setOpen(false);
  };

  const onDeleteButtonClick = async () => {
    try {
      await deleteTag(tag.id);

      setOpen(false);

      sonnerToast.success(`Tag "${tag.name}" deleted`, {
        description: 'The tag was successfully deleted!',
        action: {
          label: 'Undo',
          onClick: () => onUndeleteButtonClick(),
        },
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onUndeleteButtonClick = async () => {
    try {
      await undeleteTag(tag.id);

      setOpen(false);

      sonnerToast.success(`Tag "${tag.name}" undeleted`, {
        description: 'The tag was successfully undeleted!',
        action: {
          label: 'Undo',
          onClick: () => onUndeleteButtonClick(),
        },
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  const onHardDeleteButtonClick = async () => {
    try {
      await deleteTag(tag.id, true);

      setOpen(false);

      sonnerToast.success(`Tag "${tag.name}" hard deleted`, {
        description: 'The tag was successfully hard deleted!',
      });
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <div className="absolute right-1 top-0 ml-2">
      <DropdownMenu open={open} onOpenChange={setOpen}>
        <DropdownMenuTrigger asChild>
          <button
            className="rounded-full p-1 text-sm"
            data-test="tasks--tag-actions--dropdown-menu--trigger-button"
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56"
          align="end"
          data-test="tasks--tag-actions--dropdown-menu"
        >
          {!tag.deletedAt && (
            <>
              <DropdownMenuItem className="cursor-pointer" onClick={onEditButtonClick}>
                <PencilIcon className="mr-2 h-4 w-4" />
                <span>Edit</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={onDeleteButtonClick}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Delete</span>
              </DropdownMenuItem>
            </>
          )}
          {tag.deletedAt && (
            <>
              <DropdownMenuItem className="cursor-pointer" onClick={onUndeleteButtonClick}>
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Undelete</span>
              </DropdownMenuItem>
              <DropdownMenuItem
                variant="destructive"
                className="cursor-pointer"
                onClick={onHardDeleteButtonClick}
              >
                <TrashIcon className="mr-2 h-4 w-4" />
                <span>Hard Delete</span>
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
});

export default TagItemActions;

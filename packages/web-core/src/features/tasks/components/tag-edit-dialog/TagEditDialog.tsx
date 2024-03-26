import { UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import { CreateTag, UpdateTag, UpdateTagSchema, zodErrorToString } from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  sonnerToast,
  Switch,
} from '@moaitime/web-ui';

import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import { useTeamsStore } from '../../../teams/state/teamsStore';
import { useTagsStore } from '../../state/tagsStore';

export default function TagEditDialog() {
  const { selectedTagDialogOpen, setSelectedTagDialogOpen, selectedTagDialog, addTag, editTag } =
    useTagsStore();
  const { joinedTeam } = useTeamsStore();
  const [data, setData] = useState<CreateTag | UpdateTag>();

  useEffect(() => {
    if (!selectedTagDialog) {
      setData(undefined);

      return;
    }

    const parsedSelectedTag = UpdateTagSchema.safeParse(selectedTagDialog);
    if (!parsedSelectedTag.success) {
      sonnerToast.error('Oops!', {
        description: zodErrorToString(parsedSelectedTag.error),
      });

      return;
    }

    setData(parsedSelectedTag.data);
  }, [selectedTagDialog]);

  const onSaveButtonClick = async () => {
    try {
      const savedTag = selectedTagDialog?.id
        ? await editTag(selectedTagDialog.id, data as UpdateTag)
        : await addTag(data as CreateTag);

      sonnerToast.success(`Tag "${savedTag.name}" saved`, {
        description: `You have successfully saved the tag.`,
      });

      setSelectedTagDialogOpen(false);
      setData(undefined);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <Dialog open={selectedTagDialogOpen} onOpenChange={setSelectedTagDialogOpen}>
      <DialogContent data-test="tasks--tag-edit-dialog">
        <DialogHeader>
          <DialogTitle>
            {selectedTagDialog ? `Edit "${selectedTagDialog.name}" Tag` : 'New Tag'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="tag-name">Name</Label>
            <Input
              id="tag-name"
              type="text"
              value={data?.name ?? ''}
              placeholder="Name"
              onChange={(event) => setData((current) => ({ ...current, name: event.target.value }))}
              autoFocus
              data-test="tasks--tag-edit-dialog--name-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="tag-color">Color</Label>
            <ColorSelector
              value={data?.color ?? undefined}
              onChangeValue={(value) => setData((current) => ({ ...current, color: value }))}
              triggerProps={{
                id: 'tag-color',
                'data-test': 'tasks--tag-edit-dialog--color-select--trigger-button',
              }}
              contentProps={{
                'data-test': 'tasks--tag-edit-dialog--color-select',
              }}
            />
          </div>
          {selectedTagDialog && selectedTagDialog?.teamId && (
            <div className="text-muted-foreground text-xs">
              <UsersIcon className="mr-1 inline-block" size={16} />
              This tag was created and is owned by your team.
            </div>
          )}
          {!selectedTagDialog && joinedTeam && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Switch
                  id="tasks--tag-edit-dialog--teamId"
                  checked={(data as CreateTag)?.teamId === joinedTeam?.team.id}
                  disabled={!joinedTeam}
                  onCheckedChange={() => {
                    setData((current) => ({
                      ...current,
                      teamId: (data as CreateTag)?.teamId ? undefined : joinedTeam?.team.id,
                    }));
                  }}
                />
                <Label htmlFor="tasks--tag-edit-dialog--teamId" className="ml-2">
                  Is Team Tag?
                </Label>
              </div>
              <p className="text-muted-foreground text-xs">
                With this toggle you will create a tag and transfer the ownership to your team.
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" variant="default" onClick={onSaveButtonClick}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

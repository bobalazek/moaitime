import { UsersIcon } from 'lucide-react';
import { useEffect, useState } from 'react';

import {
  CreateList,
  UpdateList,
  UpdateListSchema,
  zodErrorToString,
} from '@moaitime/shared-common';
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
import { useListsStore } from '../../state/listsStore';

export default function ListEditDialog() {
  const {
    selectedListDialogOpen,
    setSelectedListDialogOpen,
    selectedListDialog,
    addList,
    editList,
  } = useListsStore();
  const { joinedTeam, getTeamSync } = useTeamsStore();
  const [data, setData] = useState<CreateList | UpdateList>();

  useEffect(() => {
    if (!selectedListDialog) {
      setData(undefined);

      return;
    }

    const parsedSelectedList = UpdateListSchema.safeParse(selectedListDialog);
    if (!parsedSelectedList.success) {
      sonnerToast.error('Oops!', {
        description: zodErrorToString(parsedSelectedList.error),
      });

      return;
    }

    setData(parsedSelectedList.data);
  }, [selectedListDialog]);

  const onSaveButtonClick = async () => {
    try {
      const savedList = selectedListDialog?.id
        ? await editList(selectedListDialog.id, data as UpdateList)
        : await addList(data as CreateList);

      sonnerToast.success(`List "${savedList.name}" saved`, {
        description: `You have successfully saved the list.`,
      });

      setSelectedListDialogOpen(false);
      setData(undefined);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const team = selectedListDialog?.teamId ? getTeamSync(selectedListDialog.teamId) : null;

  return (
    <Dialog open={selectedListDialogOpen} onOpenChange={setSelectedListDialogOpen}>
      <DialogContent data-test="tasks--list-edit-dialog">
        <DialogHeader>
          <DialogTitle>
            {selectedListDialog ? `Edit "${selectedListDialog.name}" List` : 'New List'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="list-name">Name</Label>
            <Input
              id="list-name"
              type="text"
              value={data?.name ?? ''}
              placeholder="Name"
              onChange={(event) => setData((current) => ({ ...current, name: event.target.value }))}
              autoFocus
              data-test="tasks--list-edit-dialog--name-input"
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="list-color">Color</Label>
            <ColorSelector
              value={data?.color ?? undefined}
              onChangeValue={(value) => setData((current) => ({ ...current, color: value }))}
              triggerProps={{
                id: 'list-color',
                'data-test': 'tasks--list-edit-dialog--color-select--trigger-button',
              }}
              contentProps={{
                'data-test': 'tasks--list-edit-dialog--color-select',
              }}
            />
          </div>
          {selectedListDialog && selectedListDialog?.teamId && (
            <div
              className="text-muted-foreground text-xs"
              title={`This list is shared with ${team?.name ?? 'your team'}`}
            >
              <UsersIcon
                className="mr-2 inline-block"
                size={16}
                style={{
                  color: team?.color ?? undefined,
                }}
              />
              This list was created and is owned by your team.
            </div>
          )}
          {!selectedListDialog && joinedTeam && (
            <div className="flex flex-col gap-2">
              <div className="flex items-center">
                <Switch
                  id="list-teamId"
                  checked={(data as CreateList)?.teamId === joinedTeam?.team.id}
                  disabled={!joinedTeam}
                  onCheckedChange={() => {
                    setData((current) => ({
                      ...current,
                      teamId: (data as CreateList)?.teamId ? undefined : joinedTeam?.team.id,
                    }));
                  }}
                />
                <Label htmlFor="list-teamId" className="ml-2">
                  Is Team List?
                </Label>
              </div>
              <p className="text-muted-foreground text-xs">
                With this toggle you will create a list and transfer the ownership to your team.
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

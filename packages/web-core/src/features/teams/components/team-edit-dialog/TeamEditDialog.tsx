import { useEffect, useState } from 'react';

import { CreateTeam, UpdateTeam } from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  sonnerToast,
} from '@moaitime/web-ui';

import { ColorSelector } from '../../../core/components/selectors/ColorSelector';
import { useTeamsStore } from '../../state/teamsStore';

export default function TeamEditDialog() {
  const {
    selectedTeamDialogOpen,
    selectedTeam,
    addTeam,
    editTeam,
    deleteTeam,
    setSelectedTeamDialogOpen,
  } = useTeamsStore();
  const [data, setData] = useState<CreateTeam | UpdateTeam>();

  useEffect(() => {
    if (!selectedTeam) {
      setData(undefined);

      return;
    }

    setData({
      name: selectedTeam.name,
      color: selectedTeam.color,
    });
  }, [selectedTeam]);

  const teamExists = !!selectedTeam?.id;

  const onDeleteButtonClick = async () => {
    if (!selectedTeam) {
      sonnerToast.error('Oops!', {
        description: 'No team selected',
      });

      return;
    }

    const result = confirm(
      'Are you sure you want to delete this team? All the members will be removed from it.'
    );
    if (!result) {
      return;
    }

    try {
      await deleteTeam(selectedTeam.id);

      sonnerToast.success(`Team "${selectedTeam.name}" deleted`, {
        description: 'You have successfully deleted the team',
      });

      setSelectedTeamDialogOpen(false, null);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  const onCancelButtonClick = () => {
    setSelectedTeamDialogOpen(false, null);
  };

  const onSaveButtonClick = async () => {
    if (!data) {
      sonnerToast.error('Oops!', {
        description: 'No data to save',
      });

      return;
    }

    try {
      const editedTeam = selectedTeam?.id
        ? await editTeam(selectedTeam.id, data as UpdateTeam)
        : await addTeam(data as CreateTeam);

      sonnerToast.success(`Team "${editedTeam.name}" saved`, {
        description: 'You have successfully saved the team',
      });

      setSelectedTeamDialogOpen(false, null);
      setData(undefined);
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <Dialog open={selectedTeamDialogOpen} onOpenChange={setSelectedTeamDialogOpen}>
      <DialogContent data-test="teams--edit-dialog">
        <DialogHeader>
          <DialogTitle className="truncate">
            {selectedTeam?.id && <>Edit "{selectedTeam.name}" Team</>}
            {!selectedTeam?.id && <>Create Team</>}
          </DialogTitle>
        </DialogHeader>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="team-name">Name</Label>
          <Input
            id="team-edit-name"
            value={data?.name ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, name: event.target.value }));
            }}
          />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="team-edit-color">Color</Label>
          <ColorSelector
            value={data?.color ?? undefined}
            onChangeValue={(value) =>
              setData((current) => ({ ...current, color: value ?? null }) as CreateTeam)
            }
          />
        </div>
        <div className="flex flex-row justify-between gap-2">
          <div>
            {teamExists && (
              <Button type="button" variant="destructive" onClick={onDeleteButtonClick}>
                Delete
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onCancelButtonClick}>
              Cancel
            </Button>
            <Button type="submit" variant="default" onClick={onSaveButtonClick}>
              Save
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

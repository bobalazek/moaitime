import { useEffect, useState } from 'react';

import { UpdateTeamUser } from '@moaitime/shared-common';
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

import { useTeamsStore } from '../../state/teamsStore';

export default function TeamMemberEditDialog() {
  const {
    selectedTeamMemberDialogOpen,
    selectedTeamMember,
    editJoinedTeamMember,
    setSelectedTeamMemberDialogOpen,
  } = useTeamsStore();
  const [data, setData] = useState<UpdateTeamUser>();

  useEffect(() => {
    setData({
      displayName: selectedTeamMember?.displayName ?? null,
      roles: selectedTeamMember?.roles ?? [],
    });
  }, [selectedTeamMember]);

  const onCancelButtonClick = () => {
    setSelectedTeamMemberDialogOpen(false, null);
  };

  const onSaveButtonClick = async () => {
    if (!selectedTeamMember || !data) {
      sonnerToast.error('Oops!', {
        description: 'No team member to save',
      });

      return;
    }

    try {
      const editedTeamMember = await editJoinedTeamMember(selectedTeamMember.userId, data);

      sonnerToast.success(
        `Team Member "${editedTeamMember?.displayName ?? editedTeamMember?.user?.displayName ?? 'Unknown'}" save`,
        {
          description: 'You have successfully saved the team',
        }
      );

      setSelectedTeamMemberDialogOpen(false, null);
      setData(undefined);
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <Dialog open={selectedTeamMemberDialogOpen} onOpenChange={setSelectedTeamMemberDialogOpen}>
      <DialogContent data-test="team-member--edit-dialog">
        <DialogHeader>
          <DialogTitle className="truncate">
            {selectedTeamMember?.id && (
              <>Edit "{selectedTeamMember.user?.displayName ?? 'Unknown'}"</>
            )}
            {!selectedTeamMember?.id && <>Create Team Member</>}
          </DialogTitle>
        </DialogHeader>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="team-member-displayName">Display name</Label>
          <Input
            id="team-member-displayName"
            placeholder={selectedTeamMember?.user?.displayName ?? undefined}
            value={data?.displayName ?? ''}
            onChange={(event) => {
              setData((current) => ({
                ...current,
                displayName: event.target.value ?? null,
                roles: current?.roles ?? [],
              }));
            }}
          />
          <div className="text-muted-foreground text-sm">
            The name that will be displayed for this team member. It is useful if you have multiple
            team members with the same name. If not set, it will use their display name as fallback.
          </div>
        </div>
        <div className="flex flex-row justify-end gap-2">
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

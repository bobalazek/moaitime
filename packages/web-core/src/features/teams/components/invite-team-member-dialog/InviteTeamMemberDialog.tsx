import { useState } from 'react';

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

export default function InviteTeamMemberDialog() {
  const {
    joinedTeam,
    inviteTeamMemberDialogOpen,
    sendTeamInvitation,
    setInviteTeamMemberDialogOpen,
  } = useTeamsStore();
  const [email, setEmail] = useState('');

  const onCancelButtonClick = () => {
    setInviteTeamMemberDialogOpen(false);
  };

  const onInviteButtonClick = async () => {
    if (!joinedTeam) {
      sonnerToast.error('Oops!', {
        description: 'No team selected',
      });

      return;
    }

    try {
      await sendTeamInvitation(joinedTeam.team.id, email);

      sonnerToast.success(`Team member "${email}" invited`, {
        description: 'You have successfully invited a team',
      });

      setInviteTeamMemberDialogOpen(false);
      setEmail('');
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <Dialog open={inviteTeamMemberDialogOpen} onOpenChange={setInviteTeamMemberDialogOpen}>
      <DialogContent data-test="team--invite-team-member-dialog">
        <DialogHeader>
          <DialogTitle>Invite a Team Member</DialogTitle>
        </DialogHeader>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="invite-team-member-email">Email</Label>
          <Input
            type="email"
            id="invite-team-member-email"
            value={email ?? ''}
            onChange={(event) => {
              setEmail(event.target.value);
            }}
          />
        </div>
        <div className="flex flex-row justify-end gap-2">
          <div className="flex gap-2">
            <Button type="button" variant="secondary" onClick={onCancelButtonClick}>
              Cancel
            </Button>
            <Button type="submit" variant="default" onClick={onInviteButtonClick}>
              Invite
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

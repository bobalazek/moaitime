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

import { useInvitationsStore } from '../../state/invitationsStore';

export default function InviteUserDialog() {
  const { inviteUserDialogOpen, sendInvitation, setInviteUserDialogOpen } = useInvitationsStore();
  const [email, setEmail] = useState('');

  const onCancelButtonClick = () => {
    setInviteUserDialogOpen(false);
  };

  const onInviteButtonClick = async () => {
    try {
      await sendInvitation(email);

      sonnerToast.success(`User "${email}" invited`, {
        description: 'You have successfully invited a user',
      });

      setInviteUserDialogOpen(false);
      setEmail('');
    } catch (error) {
      // We are already handling the error by showing a toast message inside in the fetch function
    }
  };

  return (
    <Dialog open={inviteUserDialogOpen} onOpenChange={setInviteUserDialogOpen}>
      <DialogContent data-test="social--invite-user-dialog">
        <DialogHeader>
          <DialogTitle>Invite a User</DialogTitle>
        </DialogHeader>
        <div className="mb-4 flex flex-col gap-2">
          <Label htmlFor="invite-user-email">Email</Label>
          <Input
            type="email"
            id="invite-user-email"
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

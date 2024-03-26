import { useEffect, useRef } from 'react';

import {
  Button,
  sonnerToast,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@moaitime/web-ui';

import { useInvitationsStore } from '../../state/invitationsStore';
import InviteUserDialog from '../invite-user-dialog/InviteUserDialog';

export default function InvitationsSettingsSectionContent() {
  const { invitations, setInviteUserDialogOpen, deleteInvitation, reloadInvitations } =
    useInvitationsStore();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    reloadInvitations();
  }, [reloadInvitations]);

  const onInviteButtonClick = () => {
    setInviteUserDialogOpen(true);
  };

  const onDeleteInvitationClick = async (invitationId: string) => {
    try {
      const result = confirm('Are you sure you want to remove this invitation?');
      if (!result) {
        return;
      }

      await deleteInvitation(invitationId);

      sonnerToast.success('Invitation removed', {
        description: 'The invitation has been removed',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div data-test="settings--invitation-settings--invitations">
        <h4 className="text-lg font-bold">Invitations</h4>
        {invitations.length === 0 && (
          <div className="text-muted-foreground mb-2 text-sm">You have no invitations</div>
        )}
        {invitations.length > 0 && (
          <Table data-test="settings--invitation-settings--invitations--table">
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Invited At</TableHead>
                <TableHead>Expires At</TableHead>
                <TableHead>Claimed At</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invitations.map((invitation) => (
                <TableRow key={invitation.id}>
                  <TableCell>{invitation.email}</TableCell>
                  <TableCell>{new Date(invitation.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    {invitation.expiresAt ? new Date(invitation.expiresAt).toLocaleString() : ''}
                  </TableCell>
                  <TableCell>
                    {invitation.claimedAt ? new Date(invitation.claimedAt).toLocaleString() : ''}
                  </TableCell>
                  <TableCell>
                    {invitation.permissions?.canDelete && (
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => onDeleteInvitationClick(invitation.id)}
                      >
                        Remove
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        <Button
          onClick={onInviteButtonClick}
          data-test="settings--invitation-settings--invitations--invite-user-button"
        >
          Invite a User
        </Button>
        <InviteUserDialog />
      </div>
    </div>
  );
}

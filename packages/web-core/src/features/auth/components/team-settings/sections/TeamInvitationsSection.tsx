import { TrashIcon } from 'lucide-react';

import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@moaitime/web-ui';

import { useTeamsStore } from '../../../state/teamsStore';
import InviteTeamMemberDialog from '../../invite-team-member-dialog/InviteTeamMemberDialog';

export default function TeamInvitationsSection() {
  const { joinedTeamUserInvitations, setInviteTeamMemberDialogOpen } = useTeamsStore();

  const onInviteButtonClick = () => {
    setInviteTeamMemberDialogOpen(true);
  };

  return (
    <div data-test="settings--team-settings--team-invitations">
      <h4 className="text-lg font-bold">Team Invitations</h4>
      {joinedTeamUserInvitations.length === 0 && (
        <div className="text-muted-foreground mb-2 text-sm">You have no team invitations</div>
      )}
      {joinedTeamUserInvitations.length > 0 && (
        <Table data-test="settings--team-settings--team-invitations--table">
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Invited At</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {joinedTeamUserInvitations.map((teamUserInvitation) => (
              <TableRow key={teamUserInvitation.id}>
                <TableCell>{teamUserInvitation.email}</TableCell>
                <TableCell>{new Date(teamUserInvitation.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  {teamUserInvitation.expiresAt
                    ? new Date(teamUserInvitation.expiresAt).toLocaleString()
                    : ''}
                </TableCell>
                <TableCell>
                  <Button size="sm" variant="destructive">
                    <TrashIcon size={16} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Button
        onClick={onInviteButtonClick}
        data-test="settings--team-settings--team-invitations--invite-member-button"
      >
        Invite a Member
      </Button>
      <InviteTeamMemberDialog />
    </div>
  );
}

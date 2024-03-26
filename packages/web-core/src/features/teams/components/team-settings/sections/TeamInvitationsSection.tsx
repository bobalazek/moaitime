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

import { useTeamsStore } from '../../../state/teamsStore';
import InviteTeamMemberDialog from '../../invite-team-member-dialog/InviteTeamMemberDialog';

export default function TeamInvitationsSection() {
  const { joinedTeamUserInvitations, setInviteTeamMemberDialogOpen, deleteTeamInvitation } =
    useTeamsStore();

  const onInviteButtonClick = () => {
    setInviteTeamMemberDialogOpen(true);
  };

  const onDeleteInvitationClick = async (teamUserInvitationId: string) => {
    try {
      const result = confirm('Are you sure you want to remove this team invitation?');
      if (!result) {
        return;
      }

      await deleteTeamInvitation(teamUserInvitationId);

      sonnerToast.success('Team invitation removed', {
        description: 'The team invitation has been removed',
      });
    } catch (error) {
      // Already handled by the fetch function
    }
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
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => onDeleteInvitationClick(teamUserInvitation.id)}
                  >
                    Remove
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

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
    <div>
      <h4 className="text-lg font-bold">Team Invitations</h4>
      {joinedTeamUserInvitations.length === 0 && (
        <div className="text-muted-foreground mb-2 text-sm">You have no team invitations</div>
      )}
      {joinedTeamUserInvitations.length > 0 && (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Invited At</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {joinedTeamUserInvitations.map((teamUserInvitation) => (
              <TableRow key={teamUserInvitation.id}>
                <TableCell>{teamUserInvitation.email}</TableCell>
                <TableCell>{teamUserInvitation.createdAt}</TableCell>
                <TableCell>{teamUserInvitation.expiresAt}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <Button onClick={onInviteButtonClick}>Invite a Member</Button>
      <InviteTeamMemberDialog />
    </div>
  );
}

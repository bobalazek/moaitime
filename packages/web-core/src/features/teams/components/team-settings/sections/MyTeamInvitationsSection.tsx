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

import { useAuthStore } from '../../../../auth/state/authStore';
import { useTeamsStore } from '../../../state/teamsStore';

export default function MyTeamInvitationsSection() {
  const { auth } = useAuthStore();
  const {
    myTeamUserInvitations,
    reloadMyTeamUserInvitations,
    acceptTeamInvitation,
    rejectTeamInvitation,
  } = useTeamsStore();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    reloadMyTeamUserInvitations();
  }, [reloadMyTeamUserInvitations]);

  const onAcceptInvitationButtonClick = async (teamUserInvitationId: string) => {
    try {
      await acceptTeamInvitation(teamUserInvitationId);

      sonnerToast.success('Team invitation accepted', {
        description: 'The team invitation has been accepted',
      });
    } catch (error) {
      // Already handled
    }
  };

  const onRejectInvitationButtonClick = async (teamUserInvitationId: string) => {
    try {
      await rejectTeamInvitation(teamUserInvitationId);

      sonnerToast.success('Team invitation rejected', {
        description: 'The team invitation has been rejected',
      });
    } catch (error) {
      // Already handled
    }
  };

  return (
    <div data-test="settings--team-settings--my-team-invitations">
      <h4 className="text-lg font-bold">My Team Invitations</h4>
      {myTeamUserInvitations.length === 0 && (
        <div className="text-muted-foreground mb-2 text-sm">You have no team invitations</div>
      )}
      {myTeamUserInvitations.length > 0 && (
        <Table data-test="settings--team-settings--my-team-invitations--table">
          <TableHeader>
            <TableRow>
              <TableHead>Team</TableHead>
              <TableHead>Invited By</TableHead>
              <TableHead>Invited At</TableHead>
              <TableHead>Expires At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myTeamUserInvitations.map((teamUserInvitation) => (
              <TableRow key={teamUserInvitation.id}>
                <TableCell>{teamUserInvitation.team?.name ?? 'Unknown'}</TableCell>
                <TableCell>{teamUserInvitation.invitedByUser?.displayName ?? 'Unknown'}</TableCell>
                <TableCell>{new Date(teamUserInvitation.createdAt).toLocaleString()}</TableCell>
                <TableCell>
                  {teamUserInvitation.expiresAt
                    ? new Date(teamUserInvitation.expiresAt).toLocaleString()
                    : ''}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => onAcceptInvitationButtonClick(teamUserInvitation.id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => onRejectInvitationButtonClick(teamUserInvitation.id)}
                    >
                      Reject
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      {auth?.user.emailConfirmedAt === null && (
        <div className="text-warn mt-2 text-sm">
          Keep in mind that you will need to confirm your email address before you can accept
          invitations to join a team!
        </div>
      )}
    </div>
  );
}

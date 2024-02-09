import { PencilIcon, TrashIcon } from 'lucide-react';

import { TeamUser } from '@moaitime/shared-common';
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@moaitime/web-ui';

import { useAuthStore } from '../../../state/authStore';
import { useTeamsStore } from '../../../state/teamsStore';
import TeamMemberEditDialog from '../../team-member-edit-dialog/TeamMemberEditDialog';

export default function TeamMembersSection() {
  const { auth } = useAuthStore();
  const { joinedTeamMembers, removeJoinedTeamMember, setSelectedTeamMemberDialogOpen } =
    useTeamsStore();

  const onEditTeamMemberClick = (teamUser: TeamUser) => {
    setSelectedTeamMemberDialogOpen(true, teamUser);
  };

  const onRemoveTeamMemberClick = async (userId: string) => {
    try {
      const result = confirm('Are you sure you want to remove this team member?');
      if (!result) {
        return;
      }

      await removeJoinedTeamMember(userId);
    } catch (error) {
      // Already handled
    }
  };

  return (
    <div data-test="settings--team-settings--team-members">
      <h4 className="text-lg font-bold">Team Members</h4>
      {joinedTeamMembers.length === 0 && (
        <div className="text-muted-foreground mb-2 text-sm">
          You have no team members at the moment
        </div>
      )}
      {joinedTeamMembers.length > 0 && (
        <Table data-test="settings--team-settings--team-members--table">
          <TableHeader>
            <TableRow>
              <TableHead>Member</TableHead>
              <TableHead>Roles</TableHead>
              <TableHead>Joined At</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {joinedTeamMembers.map((joinedTeamMember) => (
              <TableRow key={joinedTeamMember.id}>
                <TableCell>
                  {!joinedTeamMember.user && <>Unknown Member</>}
                  {joinedTeamMember.user && (
                    <>
                      {joinedTeamMember.user.displayName}{' '}
                      {joinedTeamMember.displayName && <>"{joinedTeamMember.displayName}"</>}
                      <small className="text-muted-foreground text-xs">
                        ({joinedTeamMember.user.email})
                      </small>
                    </>
                  )}
                </TableCell>
                <TableCell>{joinedTeamMember.roles.join(', ')}</TableCell>
                <TableCell>{new Date(joinedTeamMember.createdAt).toLocaleString()}</TableCell>
                <TableCell className="flex gap-2">
                  <Button size="sm" onClick={() => onEditTeamMemberClick(joinedTeamMember)}>
                    <PencilIcon size={16} />
                  </Button>
                  {auth?.user?.id !== joinedTeamMember.userId && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => onRemoveTeamMemberClick(joinedTeamMember.userId)}
                    >
                      <TrashIcon size={16} />
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
      <TeamMemberEditDialog />
    </div>
  );
}

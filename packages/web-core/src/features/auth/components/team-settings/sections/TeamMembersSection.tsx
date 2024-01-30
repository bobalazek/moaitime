import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@moaitime/web-ui';

import { useTeamsStore } from '../../../state/teamsStore';

export default function TeamMembersSection() {
  const { joinedTeamMembers } = useTeamsStore();

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
            </TableRow>
          </TableHeader>
          <TableBody>
            {joinedTeamMembers.map((joinedTeamMember) => (
              <TableRow key={joinedTeamMember.id}>
                <TableCell>
                  {!joinedTeamMember.user && <>Unknown Member</>}
                  {joinedTeamMember.user && (
                    <>
                      {joinedTeamMember.user.displayName} ({joinedTeamMember.user.email})
                    </>
                  )}
                </TableCell>
                <TableCell>{joinedTeamMember.roles.join(', ')}</TableCell>
                <TableCell>{new Date(joinedTeamMember.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}

import { Button } from '@moaitime/web-ui';

import { useTeamsStore } from '../../../state/teamsStore';

export default function JoinedTeamSection() {
  const { joinedTeam, leaveTeam, setSelectedTeamDialogOpen } = useTeamsStore();

  if (!joinedTeam) {
    return null;
  }

  const onEditTeamButtonClick = () => {
    setSelectedTeamDialogOpen(true, joinedTeam?.team);
  };

  const onLeaveTeamButtonClick = () => {
    const result = confirm('Are you sure you want to leave the team?');
    if (!result) {
      return;
    }

    leaveTeam(joinedTeam.team.id);
  };

  return (
    <div data-test="settings--team-settings--joined-team">
      <h4 className="text-lg font-bold">Team</h4>
      <div className="mb-2">
        You are joined to the{' '}
        <b>
          "<span className="font-bold">{joinedTeam.team.name}</span>"
        </b>{' '}
        team.
      </div>
      <div className="flex gap-2">
        {joinedTeam.team.permissions?.canUpdate && (
          <Button
            size="sm"
            variant="default"
            onClick={onEditTeamButtonClick}
            data-test="settings--team-settings--joined-team--edit-team-button"
          >
            Edit Team
          </Button>
        )}
        <Button
          size="sm"
          variant="destructive"
          onClick={onLeaveTeamButtonClick}
          data-test="settings--team-settings--joined-team--leave-team-button"
        >
          Leave Team
        </Button>
      </div>
    </div>
  );
}

import { Button } from '@moaitime/web-ui';

import { useTeamsStore } from '../../../state/teamsStore';

export default function JoinedTeamSection() {
  const { joinedTeam, setSelectedTeamDialogOpen } = useTeamsStore();

  if (!joinedTeam) {
    return null;
  }

  const onEditTeamButtonClick = () => {
    setSelectedTeamDialogOpen(true, joinedTeam?.team);
  };

  return (
    <div>
      <h4 className="text-lg font-bold">Team</h4>
      <div className="mb-2">
        You have created a team called "<span className="font-bold">{joinedTeam.team.name}</span>"
      </div>
      <div className="flex gap-2">
        <Button size="sm" variant="default" onClick={onEditTeamButtonClick}>
          Edit Team
        </Button>
      </div>
    </div>
  );
}

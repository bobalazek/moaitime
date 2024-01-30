import { Button } from '@moaitime/web-ui';

import { useTeamsStore } from '../../../state/teamsStore';

export default function CreateTeamSection() {
  const { setSelectedTeamDialogOpen } = useTeamsStore();

  const onCreateTeamButtonClick = () => {
    setSelectedTeamDialogOpen(true, null);
  };

  return (
    <div data-test="settings--team-settings--create-team">
      <h4 className="text-lg font-bold">Team</h4>
      <p className="mb-2 text-xs text-gray-400">
        Are you ready to be a leader? If you, you can create your very own team where you will be
        able to share tasks, lists, calendars and much more!
      </p>
      <Button
        size="sm"
        variant="default"
        onClick={onCreateTeamButtonClick}
        data-test="settings--team-settings--create-team--create-team-button"
      >
        Create Team
      </Button>
    </div>
  );
}

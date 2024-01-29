import { useEffect, useRef } from 'react';

import { useTeamsStore } from '../../state/teamsStore';
import CreateTeamSection from './sections/CreateTeamSection';
import JoinedTeamSection from './sections/JoinedTeamSection';

export default function TeamSettingsSectionContent() {
  const { joinedTeam, reloadJoinedTeam } = useTeamsStore();
  const isInitializedRef = useRef(false);

  useEffect(() => {
    if (isInitializedRef.current) {
      return;
    }

    isInitializedRef.current = true;

    reloadJoinedTeam();
  }, [reloadJoinedTeam]);

  return (
    <div>
      {joinedTeam && <JoinedTeamSection />}
      {!joinedTeam && <CreateTeamSection />}
    </div>
  );
}

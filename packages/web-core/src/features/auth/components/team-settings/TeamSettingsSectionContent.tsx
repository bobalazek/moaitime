import { useEffect, useRef } from 'react';

import { useTeamsStore } from '../../state/teamsStore';
import CreateTeamSection from './sections/CreateTeamSection';
import JoinedTeamSection from './sections/JoinedTeamSection';
import TeamInvitationsSection from './sections/TeamInvitationsSection';

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
    <div className="flex flex-col gap-4">
      {joinedTeam && (
        <>
          <JoinedTeamSection />
          <TeamInvitationsSection />
        </>
      )}
      {!joinedTeam && <CreateTeamSection />}
    </div>
  );
}

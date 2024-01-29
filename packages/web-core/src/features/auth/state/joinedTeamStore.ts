import { create } from 'zustand';

import { JoinedTeam } from '@moaitime/shared-common';

import { getJoinedTeam } from '../utils/TeamHelpers';

export type JoinedTeamStore = {
  joinedTeam: JoinedTeam | null;
  reloadJoinedTeam: () => Promise<void>;
};

export const useJoinedTeamStore = create<JoinedTeamStore>()((set) => ({
  joinedTeam: null,
  reloadJoinedTeam: async () => {
    const joinedTeam = await getJoinedTeam();

    set({
      joinedTeam,
    });
  },
}));

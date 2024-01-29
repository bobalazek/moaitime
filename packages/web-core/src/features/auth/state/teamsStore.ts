import { create } from 'zustand';

import { CreateTeam, JoinedTeam, Team, UpdateTeam } from '@moaitime/shared-common';

import { addTeam, deleteTeam, editTeam, getJoinedTeam } from '../utils/TeamHelpers';

export type TeamsStore = {
  addTeam: (team: CreateTeam) => Promise<Team>;
  editTeam: (teamId: string, team: UpdateTeam) => Promise<Team>;
  deleteTeam: (teamId: string) => Promise<Team>;
  // Selected
  selectedTeamDialogOpen: boolean;
  selectedTeam: Team | null;
  setSelectedTeamDialogOpen: (selectedTeamDialogOpen: boolean, selectedTeam?: Team | null) => void;
  // Joined
  joinedTeam: JoinedTeam | null;
  reloadJoinedTeam: () => Promise<void>;
};

export const useTeamsStore = create<TeamsStore>()((set, get) => ({
  addTeam: async (team: CreateTeam) => {
    const { reloadJoinedTeam } = get();

    const addedTask = await addTeam(team);

    await reloadJoinedTeam();

    return addedTask;
  },
  editTeam: async (teamId: string, team: UpdateTeam) => {
    const { reloadJoinedTeam } = get();

    const editedTask = await editTeam(teamId, team);

    await reloadJoinedTeam();

    return editedTask;
  },
  deleteTeam: async (teamId: string) => {
    const { reloadJoinedTeam } = get();

    const deletedTask = await deleteTeam(teamId);

    await reloadJoinedTeam();

    return deletedTask;
  },
  // Selected
  selectedTeamDialogOpen: false,
  selectedTeam: null,
  setSelectedTeamDialogOpen: (selectedTeamDialogOpen: boolean, selectedTeam?: Team | null) => {
    set({
      selectedTeamDialogOpen,
      selectedTeam,
    });
  },
  // Joined
  joinedTeam: null,
  reloadJoinedTeam: async () => {
    const joinedTeam = await getJoinedTeam();

    set({
      joinedTeam,
    });
  },
}));

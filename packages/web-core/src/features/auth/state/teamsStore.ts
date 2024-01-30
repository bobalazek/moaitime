import { create } from 'zustand';

import {
  CreateTeam,
  JoinedTeam,
  Team,
  TeamUser,
  TeamUserInvitation,
  UpdateTeam,
} from '@moaitime/shared-common';

import {
  acceptTeamInvitation,
  addTeam,
  deleteTeam,
  deleteTeamInvitation,
  editTeam,
  getJoinedTeam,
  getTeamInvitations,
  getTeamMembers,
  rejectTeamInvitation,
  sendTeamInvitation,
} from '../utils/TeamHelpers';

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
  joinedTeamMembers: TeamUser[];
  reloadJoinedTeamMembers: () => Promise<void>;
  // Invitations
  joinedTeamUserInvitations: TeamUserInvitation[]; // those are the invitations for that specific team
  reloadJoinedTeamUserInvitations: () => Promise<void>;
  sendTeamInvitation: (teamId: string, email: string) => Promise<TeamUserInvitation>;
  acceptTeamInvitation: (teamUserInvitationId: string) => Promise<TeamUserInvitation>;
  rejectTeamInvitation: (teamUserInvitationId: string) => Promise<TeamUserInvitation>;
  deleteTeamInvitation: (teamUserInvitationId: string) => Promise<TeamUserInvitation>;
  // Invite Team Member Dialog
  inviteTeamMemberDialogOpen: boolean;
  setInviteTeamMemberDialogOpen: (inviteTeamMemberDialogOpen: boolean) => void;
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
    const { reloadJoinedTeamMembers, reloadJoinedTeamUserInvitations } = get();

    const joinedTeam = await getJoinedTeam();

    set({
      joinedTeam,
    });

    await reloadJoinedTeamMembers();
    await reloadJoinedTeamUserInvitations();
  },
  joinedTeamMembers: [],
  reloadJoinedTeamMembers: async () => {
    const { joinedTeam } = get();
    if (!joinedTeam || !joinedTeam.team) {
      return;
    }

    const joinedTeamMembers = await getTeamMembers(joinedTeam.team.id);

    set({
      joinedTeamMembers,
    });
  },
  // Invitations
  joinedTeamUserInvitations: [],
  reloadJoinedTeamUserInvitations: async () => {
    const { joinedTeam } = get();
    if (!joinedTeam || !joinedTeam.team) {
      return;
    }

    const teamUserInvitations = await getTeamInvitations(joinedTeam.team.id);

    set({
      joinedTeamUserInvitations: teamUserInvitations,
    });
  },
  sendTeamInvitation: async (teamId: string, email: string) => {
    const { reloadJoinedTeamUserInvitations } = get();

    const teamUserInvitation = await sendTeamInvitation(teamId, email);

    await reloadJoinedTeamUserInvitations();

    return teamUserInvitation;
  },
  acceptTeamInvitation: async (teamUserInvitationId: string) => {
    const { reloadJoinedTeam } = get();

    const teamUserInvitation = await acceptTeamInvitation(teamUserInvitationId);

    await reloadJoinedTeam();

    return teamUserInvitation;
  },
  rejectTeamInvitation: async (teamUserInvitationId: string) => {
    const { reloadJoinedTeamUserInvitations } = get();

    const teamUserInvitation = await rejectTeamInvitation(teamUserInvitationId);

    await reloadJoinedTeamUserInvitations();

    return teamUserInvitation;
  },
  deleteTeamInvitation: async (teamUserInvitationId: string) => {
    const { reloadJoinedTeamUserInvitations } = get();

    const teamUserInvitation = await deleteTeamInvitation(teamUserInvitationId);

    await reloadJoinedTeamUserInvitations();

    return teamUserInvitation;
  },
  // Invite Team Member Dialog
  inviteTeamMemberDialogOpen: false,
  setInviteTeamMemberDialogOpen: (inviteTeamMemberDialogOpen: boolean) => {
    set({
      inviteTeamMemberDialogOpen,
    });
  },
}));

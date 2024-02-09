import { create } from 'zustand';

import {
  CreateTeam,
  JoinedTeam,
  Team,
  TeamUser,
  TeamUserInvitation,
  UpdateTeam,
  UpdateTeamUser,
} from '@moaitime/shared-common';

import { useCalendarStore } from '../../calendar/state/calendarStore';
import { useListsStore } from '../../tasks/state/listsStore';
import {
  acceptTeamInvitation,
  addTeam,
  deleteTeam,
  deleteTeamInvitation,
  editTeam,
  editTeamMember,
  getJoinedTeam,
  getMyTeamInvitations,
  getTeamInvitations,
  getTeamMembers,
  rejectTeamInvitation,
  removeTeamMember,
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
  // Selected Team Member
  selectedTeamMemberDialogOpen: boolean;
  selectedTeamMember: TeamUser | null;
  setSelectedTeamMemberDialogOpen: (
    selectedTeamMemberDialogOpen: boolean,
    selectedTeamMember?: TeamUser | null
  ) => void;
  // Joined
  joinedTeam: JoinedTeam | null;
  reloadJoinedTeam: () => Promise<void>;
  joinedTeamMembers: TeamUser[];
  reloadJoinedTeamMembers: () => Promise<TeamUser[]>;
  removeJoinedTeamMember: (userId: string) => Promise<TeamUser | null>;
  editJoinedTeamMember: (userId: string, data: UpdateTeamUser) => Promise<TeamUser | null>;
  // Joined Team Invitations
  joinedTeamUserInvitations: TeamUserInvitation[]; // Open invitation for that specific team
  reloadJoinedTeamUserInvitations: () => Promise<void>;
  // My Team Invitations
  myTeamUserInvitations: TeamUserInvitation[]; // Invitations from teams I have been invited to
  reloadMyTeamUserInvitations: () => Promise<void>;
  // Team Invitations
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
  // Selected Team Member
  selectedTeamMemberDialogOpen: false,
  selectedTeamMember: null,
  setSelectedTeamMemberDialogOpen: (
    selectedTeamMemberDialogOpen: boolean,
    selectedTeamMember?: TeamUser | null
  ) => {
    set({
      selectedTeamMemberDialogOpen,
      selectedTeamMember,
    });
  },
  // Joined
  joinedTeam: null,
  reloadJoinedTeam: async () => {
    const { reloadJoinedTeamMembers, reloadJoinedTeamUserInvitations } = get();
    const { reloadLists } = useListsStore.getState();
    const { reloadCalendars } = useCalendarStore.getState();

    const joinedTeam = await getJoinedTeam();

    set({
      joinedTeam,
    });

    await reloadJoinedTeamMembers();
    await reloadJoinedTeamUserInvitations();

    await reloadLists();
    await reloadCalendars();
  },
  joinedTeamMembers: [],
  reloadJoinedTeamMembers: async () => {
    const { joinedTeam } = get();
    if (!joinedTeam || !joinedTeam.team) {
      return [];
    }

    const joinedTeamMembers = await getTeamMembers(joinedTeam.team.id);

    set({
      joinedTeamMembers,
    });

    return joinedTeamMembers;
  },
  removeJoinedTeamMember: async (userId: string) => {
    const { joinedTeam, reloadJoinedTeamMembers } = get();
    if (!joinedTeam || !joinedTeam.team) {
      return null;
    }

    const teamMember = await removeTeamMember(joinedTeam.team.id, userId);

    await reloadJoinedTeamMembers();

    return teamMember;
  },
  editJoinedTeamMember: async (userId: string, data: UpdateTeamUser) => {
    const { joinedTeam, reloadJoinedTeamMembers } = get();
    if (!joinedTeam || !joinedTeam.team) {
      return null;
    }

    const teamMember = await editTeamMember(joinedTeam.team.id, userId, data);

    await reloadJoinedTeamMembers();

    return teamMember;
  },
  // Joined Team Invitations
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
  // My Team Invitations
  myTeamUserInvitations: [],
  reloadMyTeamUserInvitations: async () => {
    const teamUserInvitations = await getMyTeamInvitations();

    set({
      myTeamUserInvitations: teamUserInvitations,
    });
  },
  // Team Invitations
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

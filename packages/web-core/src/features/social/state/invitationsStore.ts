import { create } from 'zustand';

import { Invitation } from '@moaitime/shared-common';

import { deleteInvitation, getInvitations, sendInvitation } from '../utils/InvitationHelpers';

export type InvitationsStore = {
  // Invitations
  invitations: Invitation[];
  reloadInvitations: () => Promise<void>;
  sendInvitation: (email: string) => Promise<Invitation>;
  deleteInvitation: (invitationId: string) => Promise<Invitation>;
  // Invite User Dialog
  inviteUserDialogOpen: boolean;
  setInviteUserDialogOpen: (inviteUserDialogOpen: boolean) => void;
};

export const useInvitationsStore = create<InvitationsStore>()((set, get) => ({
  // Invitations
  invitations: [],
  reloadInvitations: async () => {
    const invitations = await getInvitations();

    set({
      invitations,
    });
  },
  sendInvitation: async (email: string) => {
    const { reloadInvitations } = get();

    const invitation = await sendInvitation(email);

    await reloadInvitations();

    return invitation;
  },
  deleteInvitation: async (invitationId: string) => {
    const { reloadInvitations } = get();

    const invitation = await deleteInvitation(invitationId);

    await reloadInvitations();

    return invitation;
  },
  // Invite User Dialog
  inviteUserDialogOpen: false,
  setInviteUserDialogOpen: (inviteUserDialogOpen: boolean) => {
    set({
      inviteUserDialogOpen,
    });
  },
}));

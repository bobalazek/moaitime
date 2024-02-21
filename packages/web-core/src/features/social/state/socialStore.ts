import { create } from 'zustand';

import { CreateReport, PublicUser } from '@moaitime/shared-common';

import {
  approveFollowerUser,
  blockUser,
  followUser,
  removeFollowerUser,
  reportUser,
  unblockUser,
  unfollowUser,
} from '../utils/UserHelpers';

export type SocialStore = {
  /********** General **********/
  followUser: (userIdOrUsername: string) => Promise<void>;
  unfollowUser: (userIdOrUsername: string) => Promise<void>;
  approveFollowerUser: (userIdOrUsername: string) => Promise<void>;
  removeFollowerUser: (userIdOrUsername: string) => Promise<void>;
  blockUser: (userIdOrUsername: string) => Promise<void>;
  unblockUser: (userIdOrUsername: string) => Promise<void>;
  reportUser: (userIdOrUsername: string, data: CreateReport) => Promise<void>;
  // Report Dialog
  userReportDialogOpen: boolean;
  userReportDialog: PublicUser | null;
  setUserReportDialogOpen: (
    userReportDialogOpen: boolean,
    userReportDialog?: PublicUser | null
  ) => Promise<void>;
};
export const useSocialStore = create<SocialStore>()((set) => ({
  /********** General **********/
  followUser: async (userIdOrUsername: string) => {
    await followUser(userIdOrUsername);
  },
  unfollowUser: async (userIdOrUsername: string) => {
    await unfollowUser(userIdOrUsername);
  },
  approveFollowerUser: async (userIdOrUsername: string) => {
    await approveFollowerUser(userIdOrUsername);
  },
  removeFollowerUser: async (userIdOrUsername: string) => {
    await removeFollowerUser(userIdOrUsername);
  },
  blockUser: async (userIdOrUsername: string) => {
    await blockUser(userIdOrUsername);
  },
  unblockUser: async (userIdOrUsername: string) => {
    await unblockUser(userIdOrUsername);
  },
  reportUser: async (userIdOrUsername: string, data: CreateReport) => {
    await reportUser(userIdOrUsername, data);
  },
  // Report Dialog
  userReportDialogOpen: false,
  userReportDialog: null,
  setUserReportDialogOpen: async (
    userReportDialogOpen: boolean,
    userReportDialog?: PublicUser | null
  ) => {
    set({
      userReportDialogOpen,
      userReportDialog,
    });
  },
}));

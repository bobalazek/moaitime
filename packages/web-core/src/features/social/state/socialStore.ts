import { create } from 'zustand';

import {
  approveFollowerUser,
  blockUser,
  followUser,
  removeFollowerUser,
  unblockUser,
  unfollowUser,
} from '../utils/UserHelpers';

export type SocialStore = {
  followUser: (userIdOrUsername: string) => Promise<void>;
  unfollowUser: (userIdOrUsername: string) => Promise<void>;
  approveFollowerUser: (userIdOrUsername: string) => Promise<void>;
  removeFollowerUser: (userIdOrUsername: string) => Promise<void>;
  blockUser: (userIdOrUsername: string) => Promise<void>;
  unblockUser: (userIdOrUsername: string) => Promise<void>;
};

export const useSocialStore = create<SocialStore>()(() => ({
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
}));

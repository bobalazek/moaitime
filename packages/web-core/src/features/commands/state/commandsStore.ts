import { create } from 'zustand';

import { useTasksStore } from '../../tasks/state/tasksStore';

export type CommandsStore = {
  /********** General **********/
  commandsDialogOpen: boolean;
  setCommandsDialogOpen: (commandsDialogOpen: boolean) => void;
  // Search
  search: string;
  setSearch: (search: string) => void;
};

export const useCommandsStore = create<CommandsStore>()((set) => ({
  /********** General **********/
  commandsDialogOpen: false,
  setCommandsDialogOpen: (commandsDialogOpen: boolean) => {
    set({
      commandsDialogOpen,
    });

    if (commandsDialogOpen) {
      useTasksStore.getState().loadLists();
    }
  },
  // Search
  search: '',
  setSearch: (search: string) => {
    set({
      search,
    });
  },
}));

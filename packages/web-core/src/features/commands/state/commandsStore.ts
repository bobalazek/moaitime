import { create } from 'zustand';

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
  },
  // Search
  search: '',
  setSearch: (search: string) => {
    set({
      search,
    });
  },
}));

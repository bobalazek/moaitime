import { FaCircle, FaExternalLinkAlt, FaPlus, FaTasks } from 'react-icons/fa';

import { CommandGroup, CommandItem } from '@myzenbuddy/web-ui';

import { useAuthStore } from '../../auth/state/authStore';
import { useCommandsStore } from '../../commands/state/commandsStore';
import { useTasksStore } from '../state/tasksStore';

export default function TasksCommandsList() {
  const { auth } = useAuthStore();
  const { setListFormDialogOpen, setPopoverOpen, setSelectedList, lists } = useTasksStore();
  const { setCommandsDialogOpen } = useCommandsStore();

  const tasksEnabled = auth?.user?.settings?.tasksEnabled ?? false;

  if (!tasksEnabled) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <FaTasks className="mr-2" />
          <span className="font-bold">Tasks</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          setPopoverOpen(true);

          setCommandsDialogOpen(false);
        }}
      >
        <FaExternalLinkAlt className="mr-2" />
        <span>
          Open <b>Tasks</b>
        </span>
      </CommandItem>
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          setListFormDialogOpen(true);

          setCommandsDialogOpen(false);
        }}
      >
        <FaPlus className="mr-2" />
        <span>New List</span>
      </CommandItem>
      {lists.map((list) => (
        <CommandItem
          key={list.id}
          className="cursor-pointer"
          onSelect={() => {
            setPopoverOpen(true);
            setSelectedList(list);

            setCommandsDialogOpen(false);
          }}
        >
          <FaCircle
            className="mr-2"
            style={{
              color: list.color,
            }}
          />
          <span>
            Open <b>{list.name}</b> List
          </span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

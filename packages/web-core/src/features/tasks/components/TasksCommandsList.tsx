import { CircleIcon, ExternalLinkIcon, ListChecksIcon, PlusIcon } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { CommandGroup, CommandItem } from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../auth/state/authStore';
import { useCommandsStore } from '../../commands/state/commandsStore';
import { useListsStore } from '../state/listsStore';
import { useTasksStore } from '../state/tasksStore';

export default function TasksCommandsList() {
  const { setPopoverOpen } = useTasksStore();
  const { setSelectedListDialogOpen, setSelectedList, lists } = useListsStore();
  const { setCommandsDialogOpen } = useCommandsStore();
  const navigate = useNavigate();
  const location = useLocation();

  const tasksEnabled = useAuthUserSetting('tasksEnabled', false);

  const goToHomeIfRequired = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

  if (!tasksEnabled) {
    return null;
  }

  return (
    <CommandGroup
      heading={
        <div className="flex items-center">
          <ListChecksIcon className="mr-2" />
          <span className="font-bold">Tasks</span>
        </div>
      }
    >
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          goToHomeIfRequired();

          setPopoverOpen(true);

          setCommandsDialogOpen(false);
        }}
      >
        <ExternalLinkIcon className="mr-2" />
        <span>
          Open <b>Tasks</b>
        </span>
      </CommandItem>
      <CommandItem
        className="cursor-pointer"
        onSelect={() => {
          setSelectedListDialogOpen(true);

          setCommandsDialogOpen(false);
        }}
      >
        <PlusIcon className="mr-2" />
        <span>New List</span>
      </CommandItem>
      {lists.map((list) => (
        <CommandItem
          key={list.id}
          className="cursor-pointer"
          onSelect={async () => {
            goToHomeIfRequired();

            await setPopoverOpen(true);

            await setSelectedList(list);

            setCommandsDialogOpen(false);
          }}
        >
          <span
            style={{
              color: list.color ?? undefined,
            }}
          >
            <CircleIcon className="mr-2" />
          </span>
          <span>
            Open <b>{list.name}</b> List
          </span>
        </CommandItem>
      ))}
    </CommandGroup>
  );
}

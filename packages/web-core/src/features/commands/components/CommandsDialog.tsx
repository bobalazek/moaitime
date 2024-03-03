import { useEffect } from 'react';

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  Dialog,
  DialogContent,
} from '@moaitime/web-ui';

import { useAuthUserSetting } from '../../auth/state/authStore';
import CalendarCommandsList from '../../calendar/components/CalendarCommandsList';
import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import FocusCommandsList from '../../focus/components/FocusCommandsList';
import HabitsCommandsList from '../../habits/components/HabitsCommandsList';
import MoodCommandsList from '../../mood/components/MoodCommandsList';
import NotesCommandsList from '../../notes/components/NotesCommandsList';
import SettingsCommandsList from '../../settings/components/SettingsCommandsList';
import TasksCommandsList from '../../tasks/components/TasksCommandsList';
// import WeatherCommandsList from '../../weather/components/WeatherCommandsList';
import { useCommandsStore } from '../state/commandsStore';

export default function CommandsDialog() {
  const commandsEnabled = useAuthUserSetting('commandsEnabled', false);
  const { commandsDialogOpen, setCommandsDialogOpen, search, setSearch } = useCommandsStore();

  const shortcutText = navigator.userAgent.includes('Mac OS X') ? '⌘ K' : 'Ctrl K';

  useEffect(() => {
    if (!commandsEnabled) {
      return;
    }

    const onKeydown = (event: KeyboardEvent) => {
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        event.preventDefault();

        setCommandsDialogOpen(!commandsDialogOpen);
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [commandsEnabled]);

  if (!commandsEnabled) {
    return null;
  }

  return (
    <ErrorBoundary>
      <Dialog open={commandsDialogOpen} onOpenChange={setCommandsDialogOpen}>
        <DialogContent className="overflow-hidden p-0 shadow-lg" data-test="commands--dialog">
          <Command
            loop
            className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5"
          >
            <CommandInput
              data-test="commands-dialog-input"
              value={search}
              onValueChange={setSearch}
            />
            <CommandList data-test="commands-dialog-list">
              <CommandEmpty>
                No results found for "<b>{search}</b>".
              </CommandEmpty>
              <TasksCommandsList />
              <HabitsCommandsList />
              <CalendarCommandsList />
              <NotesCommandsList />
              {/* <WeatherCommandsList /> */}
              <MoodCommandsList />
              <FocusCommandsList />
              <SettingsCommandsList />
            </CommandList>
          </Command>
          <div className="text-muted-foreground border-t p-2 text-xs">
            <kbd className="bg-muted pointer-events-none select-none items-center gap-1 rounded border px-1 font-mono">
              {shortcutText}
            </kbd>{' '}
            to open the command palette
          </div>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}

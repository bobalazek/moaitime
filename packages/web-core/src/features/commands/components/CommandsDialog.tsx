import { useEffect } from 'react';

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandList,
  Dialog,
  DialogContent,
} from '@moaitime/web-ui';

import CalendarCommandsList from '../../calendar/components/CalendarCommandsList';
import { ErrorBoundary } from '../../core/components/ErrorBoundary';
import MoodCommandsList from '../../mood/components/MoodCommandsList';
import NotesCommandsList from '../../notes/components/NotesCommandsList';
import SettingsCommandsList from '../../settings/components/SettingsCommandsList';
import TasksCommandsList from '../../tasks/components/TasksCommandsList';
// import WeatherCommandsList from '../../weather/components/WeatherCommandsList';
import { useCommandsStore } from '../state/commandsStore';

export default function CommandsDialog() {
  const { commandsDialogOpen, setCommandsDialogOpen, search, setSearch } = useCommandsStore();

  useEffect(() => {
    const onKeydown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();

        setCommandsDialogOpen(!commandsDialogOpen);
      }
    };

    document.addEventListener('keydown', onKeydown);

    return () => document.removeEventListener('keydown', onKeydown);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
              <CalendarCommandsList />
              <NotesCommandsList />
              {/* <WeatherCommandsList /> */}
              <MoodCommandsList />
              <SettingsCommandsList />
            </CommandList>
          </Command>
        </DialogContent>
      </Dialog>
    </ErrorBoundary>
  );
}

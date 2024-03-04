import { CogIcon } from 'lucide-react';

import {
  Button,
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  ScrollArea,
} from '@moaitime/web-ui';

import UsageBadge from '../../../core/components/UsageBadge';
import { useHabitsStore } from '../../state/habitsStore';
import HabitsSettingsDialogHabits from './HabitsSettingsDialogHabits';
import HabitsSettingsDialogHabitsActions from './HabitsSettingsDialogHabitsActions';

export default function HabitsSettingsDialog() {
  const { settingsDialogOpen, setSettingsDialogOpen } = useHabitsStore();

  return (
    <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          className="border"
          variant="ghost"
          size="sm"
          title="Open habits settings"
          data-test="habits--header--open-settings-button"
        >
          <CogIcon />
        </Button>
      </DialogTrigger>
      <DialogContent data-test="habits--settings-dialog">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Here you are able to specify the which events and tasks you want to see.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-12rem)]">
          <div className="mt-4" data-test="habits--settings-dialog--habits-wrapper">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-bold">Habits</h3>
              <HabitsSettingsDialogHabitsActions />
              <UsageBadge limitKey="habitsMaxPerUserCount" usageKey="habitsCount" />
            </div>
            <HabitsSettingsDialogHabits />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

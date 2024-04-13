import { CogIcon, InfoIcon } from 'lucide-react';

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

export type HabitsSettingsDialogProps = {
  includeTrigger?: boolean;
};

export default function HabitsSettingsDialog({ includeTrigger }: HabitsSettingsDialogProps) {
  const { settingsDialogOpen, setSettingsDialogOpen } = useHabitsStore();

  return (
    <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
      {includeTrigger && (
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
      )}
      <DialogContent data-test="habits--settings-dialog">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Here you are able to specify the which events and tasks you want to see.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-12rem)]">
          <div data-test="habits--settings-dialog--habits-wrapper">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-bold">Habits</h3>
              <HabitsSettingsDialogHabitsActions />
              <UsageBadge limitKey="habitsMaxPerUserCount" usageKey="habitsCount" />
            </div>
            <HabitsSettingsDialogHabits />
          </div>
          <hr className="my-3" />
          <h3 className="mb-1 flex items-center gap-2 font-bold">
            <InfoIcon size={16} /> Information
          </h3>
          <div className="text-muted-foreground text-xs">
            The progress bar at the bottom of each habit is the completion percentage of the habit
            in the relation to the goal. A habit with a daily goal will show 50% progress at noon
            each day. Likewise, if the goal is weekly, the progress will be 50% on Wednesday and so
            forth.
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

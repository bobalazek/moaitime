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
import { useGoalsStore } from '../../state/goalsStore';
import GoalsSettingsDialogGoals from './GoalsSettingsDialogHabits';
import GoalsSettingsDialogGoalsActions from './GoalsSettingsDialogHabitsActions';

export type GoalsSettingsDialogProps = {
  includeTrigger?: boolean;
};

export default function GoalsSettingsDialog({ includeTrigger }: GoalsSettingsDialogProps) {
  const { settingsDialogOpen, setSettingsDialogOpen } = useGoalsStore();

  return (
    <Dialog open={settingsDialogOpen} onOpenChange={setSettingsDialogOpen}>
      {includeTrigger && (
        <DialogTrigger asChild>
          <Button
            className="border"
            variant="ghost"
            size="sm"
            title="Open goals settings"
            data-test="goals--header--open-settings-button"
          >
            <CogIcon />
          </Button>
        </DialogTrigger>
      )}
      <DialogContent data-test="goals--settings-dialog">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Here you are able to specify the which goals you want to see.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[calc(100vh-12rem)]">
          <div data-test="goals--settings-dialog--goals-wrapper">
            <div className="mb-1 flex items-center gap-2">
              <h3 className="font-bold">Goals</h3>
              <GoalsSettingsDialogGoalsActions />
              <UsageBadge limitKey="goalsMaxPerUserCount" usageKey="goalsCount" />
            </div>
            <GoalsSettingsDialogGoals />
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

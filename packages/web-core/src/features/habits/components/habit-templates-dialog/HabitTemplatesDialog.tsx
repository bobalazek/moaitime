import { clsx } from 'clsx';

import { Habit, HabitTemplate } from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  ScrollArea,
} from '@moaitime/web-ui';

import { useHabitsStore } from '../../state/habitsStore';

const HabitTemplateItem = ({ habitTemplate }: { habitTemplate: HabitTemplate }) => {
  const { setSelectedHabitDialogOpen, setHabitTemplatesDialogOpen } = useHabitsStore();

  const onAddButtonClick = () => {
    setSelectedHabitDialogOpen(true, {
      name: habitTemplate.name,
      description: habitTemplate.description ?? undefined,
      color: habitTemplate.color ?? undefined,
      goalAmount: habitTemplate.goalAmount,
      goalUnit: habitTemplate.goalUnit,
      goalFrequency: habitTemplate.goalFrequency,
    } as Habit);

    setHabitTemplatesDialogOpen(false);
  };

  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h4 className="mb-1">{habitTemplate.name}</h4>
        <div className="text-muted-foreground text-xs">{habitTemplate.description}</div>
      </div>
      <Button variant="outline" size="sm" className="mt-2" onClick={onAddButtonClick}>
        Add
      </Button>
    </div>
  );
};

export default function HabitTemplatesDialog() {
  const { habitTemplates, habitTemplatesDialogOpen, setHabitTemplatesDialogOpen } =
    useHabitsStore();

  const habitTemplatesByCategory = habitTemplates.reduce(
    (acc, habitTemplate) => {
      if (!acc[habitTemplate.category]) {
        acc[habitTemplate.category] = [];
      }

      acc[habitTemplate.category].push(habitTemplate);

      return acc;
    },
    {} as Record<string, HabitTemplate[]>
  );

  const habitTemplateCategories = Object.keys(habitTemplatesByCategory);

  return (
    <Dialog open={habitTemplatesDialogOpen} onOpenChange={setHabitTemplatesDialogOpen}>
      <DialogContent data-test="habits--habit-templates-dialog">
        <DialogHeader>
          <DialogTitle>Habit Templates</DialogTitle>
        </DialogHeader>
        {habitTemplates.length === 0 && (
          <div className="flex flex-col items-center justify-center">
            <div className="text-muted-foreground text-center">No habit templates</div>
          </div>
        )}
        {habitTemplates.length > 0 && (
          <ScrollArea className="max-h-[calc(100vh-12rem)] pb-6">
            {habitTemplateCategories.map((habitTemplateCategory, index) => {
              const templates = habitTemplatesByCategory[habitTemplateCategory];
              const isLastCategory = index === habitTemplateCategories.length - 1;

              return (
                <div key={habitTemplateCategory}>
                  <div className="mb-2 text-lg font-bold">{habitTemplateCategory}</div>
                  <div
                    key={habitTemplateCategory}
                    className={clsx(!isLastCategory ? 'mb-6 border-b pb-6' : undefined)}
                  >
                    <div className="flex flex-col gap-2">
                      {templates.map((habitTemplate) => (
                        <HabitTemplateItem key={habitTemplate.name} habitTemplate={habitTemplate} />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  );
}

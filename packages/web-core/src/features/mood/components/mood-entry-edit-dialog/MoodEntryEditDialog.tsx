import { useEffect, useState } from 'react';

import {
  CreateMoodEntry,
  UpdateMoodEntry,
  UpdateMoodEntrySchema,
  zodErrorToString,
} from '@moaitime/shared-common';
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Label,
  sonnerToast,
  Textarea,
} from '@moaitime/web-ui';

import {
  convertIsoStringToObject,
  convertObjectToIsoString,
} from '../../../calendar/utils/CalendarHelpers';
import DateSelector from '../../../core/components/selectors/DateSelector';
import { useMoodEntriesStore } from '../../state/moodEntriesStore';
import { HappinessScoreIcon } from '../common/HappinesScoreIcon';

const moodScores = [
  { score: 2, label: 'great' },
  { score: 1, label: 'good' },
  { score: 0, label: 'neutral' },
  { score: -1, label: 'bad' },
  { score: -2, label: 'terrible' },
];

export default function MoodEntryEditDialog() {
  const {
    selectedMoodEntryDialogOpen,
    setSelectedMoodEntryDialogOpen,
    selectedMoodEntryDialog,
    addMoodEntry,
    editMoodEntry,
  } = useMoodEntriesStore();
  const [data, setData] = useState<UpdateMoodEntry>();

  useEffect(() => {
    if (!selectedMoodEntryDialog) {
      const loggedAt = new Date();
      loggedAt.setMinutes(loggedAt.getMinutes() - loggedAt.getTimezoneOffset());

      setData({
        loggedAt: loggedAt.toISOString().slice(0, -1),
      });

      return;
    }

    const parsedSelectedMoodEntry = UpdateMoodEntrySchema.safeParse(selectedMoodEntryDialog);
    if (!parsedSelectedMoodEntry.success) {
      sonnerToast.error('Oops!', {
        description: zodErrorToString(parsedSelectedMoodEntry.error),
      });

      return;
    }

    setData(parsedSelectedMoodEntry.data);
  }, [selectedMoodEntryDialog]);

  const onSaveButtonClick = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const savedMoodEntry = selectedMoodEntryDialog
        ? await editMoodEntry(selectedMoodEntryDialog.id, data as UpdateMoodEntry)
        : await addMoodEntry(data as CreateMoodEntry);

      sonnerToast.success(`Mood entry saved`, {
        description: `You have successfully saved the mood entry.`,
      });

      setSelectedMoodEntryDialogOpen(false);
      setData(undefined);
    } catch (error) {
      sonnerToast.error('Oops!', {
        description:
          error instanceof Error
            ? error.message
            : 'Something went wrong while saving the mood entry.',
      });
    }
  };

  return (
    <Dialog open={selectedMoodEntryDialogOpen} onOpenChange={setSelectedMoodEntryDialogOpen}>
      <DialogContent data-test="mood--mood-entry-edit-dialog">
        <DialogHeader>
          <DialogTitle>
            {selectedMoodEntryDialog ? `Edit Mood entry` : 'New Mood Entry'}
          </DialogTitle>
        </DialogHeader>
        <div className="flex w-full flex-row justify-between gap-2 py-4">
          {moodScores.map((moodScore) => {
            const isSelected = moodScore.score === data?.happinessScore;
            return (
              <div
                key={moodScore.score}
                className="cursor-pointer transition-all hover:scale-[1.1]"
                onClick={() => {
                  setData((current) => ({ ...current, happinessScore: moodScore.score }));
                }}
                style={{
                  scale: isSelected ? '1.4' : '1',
                  opacity: isSelected ? '1' : '0.8',
                }}
              >
                <HappinessScoreIcon
                  score={moodScore.score}
                  size={48}
                  strokeWidth={isSelected ? 2 : 1.5}
                />
                <div className="mt-1.5 text-center text-xs font-semibold">{moodScore.label}</div>
              </div>
            );
          })}
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="moodEntry-note">Note</Label>
          <Textarea
            id="moodEntry-note"
            rows={5}
            value={data?.note ?? ''}
            onChange={(event) => {
              setData((current) => ({ ...current, note: event.target.value }));
            }}
          />
        </div>
        <DateSelector
          includeTime={true}
          data={convertIsoStringToObject(data?.loggedAt, true, undefined)}
          onSaveData={(saveData) => {
            const result = convertObjectToIsoString(saveData);
            if (!result) {
              return;
            }

            setData((current) => ({
              ...current,
              loggedAt: result.iso,
            }));
          }}
          disableClear={true}
          disableFuture={true}
          disableTimeZone={true}
        />
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" variant="default" onClick={onSaveButtonClick}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
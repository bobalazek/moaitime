import { Button } from '@moaitime/web-ui';

import { useMoodEntrysStore } from '../../../state/moodEntriesStore';

const MoodPageHeaderButtons = () => {
  const { setSelectedMoodEntryDialogOpen } = useMoodEntrysStore();

  const onAddMoodButtonClick = () => {
    setSelectedMoodEntryDialogOpen(true, null);
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="default" className="h-8" onClick={onAddMoodButtonClick}>
        Add Mood
      </Button>
    </div>
  );
};

export default MoodPageHeaderButtons;

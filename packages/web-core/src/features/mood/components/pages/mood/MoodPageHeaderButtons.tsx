import { SmilePlusIcon } from 'lucide-react';

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
        <SmilePlusIcon size={24} />
      </Button>
    </div>
  );
};

export default MoodPageHeaderButtons;

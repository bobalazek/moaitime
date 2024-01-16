import { SmilePlusIcon } from 'lucide-react';

import { Button } from '@moaitime/web-ui';

import { useMoodEntriesStore } from '../../../state/moodEntriesStore';

const MoodPageHeaderButtons = () => {
  const { setSelectedMoodEntryDialogOpen } = useMoodEntriesStore();

  const onAddMoodButtonClick = () => {
    setSelectedMoodEntryDialogOpen(true, null);
  };

  return (
    <div className="flex gap-2">
      <Button size="sm" variant="default" className="h-8" onClick={onAddMoodButtonClick}>
        <SmilePlusIcon size={24} data-test="mood--header--add-new-mood-button" />
      </Button>
    </div>
  );
};

export default MoodPageHeaderButtons;

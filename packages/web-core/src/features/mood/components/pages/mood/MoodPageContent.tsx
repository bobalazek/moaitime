import MoodEntriesActivity from '../../mood-entries-activity/MoodEntriesActivity';

const MoodPageContent = () => {
  return (
    <div className="container py-4" data-test="mood--content">
      <MoodEntriesActivity />
    </div>
  );
};

export default MoodPageContent;

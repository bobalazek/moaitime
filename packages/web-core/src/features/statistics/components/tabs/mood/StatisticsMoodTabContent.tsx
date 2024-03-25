import MoodBasicsSection from './MoodBasicsSection';
import MoodEntriesCreatedSection from './MoodEntriesCreatedSection';

export default function StatisticsMoodTabContent() {
  return (
    <div className="flex flex-col gap-4">
      <MoodBasicsSection />
      <MoodEntriesCreatedSection />
    </div>
  );
}

import MoodBasicsSection from './MoodBasicsSection';
import MoodEntriesCreatedSection from './MoodEntriesCreatedSection';

export default function StatisticsMoodTabContent() {
  return (
    <div className="space-y-4">
      <MoodBasicsSection />
      <MoodEntriesCreatedSection />
    </div>
  );
}

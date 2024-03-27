import HabitsBasicsSection from './HabitsBasicsSection';
import HabitsCreatedSection from './HabitsCreatedSection';

export default function StatisticsHabitsTabContent() {
  return (
    <div className="flex flex-col gap-4">
      <HabitsBasicsSection />
      <HabitsCreatedSection />
    </div>
  );
}

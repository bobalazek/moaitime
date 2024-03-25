import FocusBasicsSection from './FocusBasicsSection';
import FocusSessionsCreatedSection from './FocusSessionsCreatedSection';

export default function StatisticsFocusTabContent() {
  return (
    <div className="flex flex-col gap-4">
      <FocusBasicsSection />
      <FocusSessionsCreatedSection />
    </div>
  );
}

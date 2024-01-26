import FocusBasicsSection from './FocusBasicsSection';
import FocusSessionsCreatedSection from './FocusSessionsCreatedSection';

export default function StatisticsFocusTabContent() {
  return (
    <div className="space-y-4">
      <FocusBasicsSection />
      <FocusSessionsCreatedSection />
    </div>
  );
}

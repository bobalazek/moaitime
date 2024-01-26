import CalendarBasicsSection from './CalendarBasicsSection';
import EventsCreatedSection from './EventsCreatedSection';

export default function StatisticsCalendarTabContent() {
  return (
    <div className="space-y-4">
      <CalendarBasicsSection />
      <EventsCreatedSection />
    </div>
  );
}

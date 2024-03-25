import CalendarBasicsSection from './CalendarBasicsSection';
import EventsCreatedSection from './EventsCreatedSection';

export default function StatisticsCalendarTabContent() {
  return (
    <div className="flex flex-col gap-4">
      <CalendarBasicsSection />
      <EventsCreatedSection />
    </div>
  );
}

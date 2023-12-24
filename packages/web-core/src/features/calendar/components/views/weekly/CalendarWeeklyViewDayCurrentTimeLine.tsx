export type CalendarWeeklyViewDayCurrentTimeLineProps = {
  top: number;
};

export default function CalendarWeeklyViewDayCurrentTimeLine({
  top,
}: CalendarWeeklyViewDayCurrentTimeLineProps) {
  return (
    <div
      className="absolute w-full"
      style={{
        top,
      }}
      data-test="calendar--weekly-view--day--current-time-line"
    >
      <div className="relative h-[2px] bg-red-500">
        <div className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500" />
      </div>
    </div>
  );
}

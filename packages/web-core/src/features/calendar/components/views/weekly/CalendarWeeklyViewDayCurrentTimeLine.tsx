export type CalendarWeeklyViewDayCurrentTimeLineProps = {
  top: number;
};

export default function CalendarWeeklyViewDayCurrentTimeLine({
  top,
}: CalendarWeeklyViewDayCurrentTimeLineProps) {
  const additionalStyles = {
    boxShadow: '1px 1px 4px 1px rgba(0, 0, 0, 0.2)',
  };

  return (
    <div
      className="absolute z-[10] w-full"
      style={{
        top,
      }}
      data-test="calendar--weekly-view--day--current-time-line"
    >
      <div className="relative h-[2px] bg-red-500" style={additionalStyles}>
        <div
          className="absolute left-0 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-red-500"
          style={additionalStyles}
        />
      </div>
    </div>
  );
}

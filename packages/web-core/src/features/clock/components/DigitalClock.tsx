export default function DigitalClock({
  time,
  use24HourClock,
  showSeconds,
}: {
  time: Date;
  use24HourClock: boolean;
  showSeconds: boolean;
}) {
  const text = time.toLocaleTimeString('en-US', {
    hour12: !use24HourClock,
    hour: 'numeric',
    minute: 'numeric',
    second: showSeconds ? 'numeric' : undefined,
  });

  return (
    <div
      className="text-shadow pointer-events-none font-mono text-6xl font-extrabold tracking-tighter text-white sm:text-7xl md:text-8xl lg:text-9xl"
      data-test="clock--digital-clock"
    >
      {text}
    </div>
  );
}

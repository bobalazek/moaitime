import './AnalogClock.css';

export default function AnalogClock({ time, showSeconds }: { time: Date; showSeconds: boolean }) {
  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();
  const hourDegrees = (hours % 12) * 30 + minutes * 0.5 + 180;
  const minuteDegrees = minutes * 6 + 180;
  const secondDegrees = seconds * 6 + 180;

  return (
    <div className="relative h-[300px] w-[300px]" data-test="clock--analog-clock">
      <div className="clock">
        <div className="clock-center-dot" />
        <div className="clock-hands">
          <div
            className="hand hour-hand"
            style={{
              transform: `rotateZ(${hourDegrees}deg)`,
            }}
          />
          <div
            className="hand minute-hand"
            style={{
              transform: `rotateZ(${minuteDegrees}deg)`,
            }}
          />
          {showSeconds && (
            <div
              className="hand second-hand"
              style={{
                transform: `rotateZ(${secondDegrees}deg)`,
              }}
            />
          )}
        </div>
        <div className="clock-faces">
          <span className="face face-1">1</span>
          <span className="face face-2">2</span>
          <span className="face face-3">3</span>
          <span className="face face-4">4</span>
          <span className="face face-5">5</span>
          <span className="face face-6">6</span>
          <span className="face face-7">7</span>
          <span className="face face-8">8</span>
          <span className="face face-9">9</span>
          <span className="face face-10">10</span>
          <span className="face face-11">11</span>
          <span className="face face-12">12</span>
        </div>
      </div>
    </div>
  );
}

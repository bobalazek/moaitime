import { XIcon } from 'lucide-react';
import { MouseEvent, useEffect, useState } from 'react';

import { durationToHoursMinutesSeconds, getDurationText } from '@moaitime/shared-common';
import { Button, Input, Popover, PopoverContent, PopoverTrigger } from '@moaitime/web-ui';

const durationPresets = [5, 10, 15, 30, 45, 60];

export function DurationSelector({
  value,
  onChangeValue,
}: {
  value?: number;
  onChangeValue: (value?: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(0);
  const [seconds, setSeconds] = useState(0);

  const setHoursMinutesSeconds = (durationMinutes?: number) => {
    const {
      hours: newHours,
      minutes: newMinutes,
      seconds: newSeconds,
    } = durationToHoursMinutesSeconds(durationMinutes ?? 0);

    setHours(newHours);
    setMinutes(newMinutes);
    setSeconds(newSeconds);
  };

  useEffect(() => {
    setHoursMinutesSeconds(value);
  }, [value]);

  const onClearButtonClick = (event: MouseEvent) => {
    event.preventDefault();

    onChangeValue(undefined);

    setOpen(false);
  };

  const onSaveButtonSave = () => {
    const totalSeconds = hours * 3600 + minutes * 60 + seconds;
    if (!isNaN(totalSeconds) && totalSeconds >= 0) {
      onChangeValue(totalSeconds);
      setOpen(false);
    } else {
      onChangeValue(undefined);
      setOpen(false);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          aria-expanded={open}
          className="w-full justify-between"
          data-test="duration-selector--trigger-button"
        >
          <span className="flex">
            {value && <span>{getDurationText(value)}</span>}
            {!value && <span className="text-muted-foreground">Select duration ...</span>}
          </span>
          {value && (
            <span className="text-muted-foreground rounded-full p-1" onClick={onClearButtonClick}>
              <XIcon />
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="flex w-[360px] flex-col gap-4 p-2" data-test="duration-selector">
        <div className="flex gap-2">
          <Input
            type="number"
            placeholder="Hours"
            value={hours}
            onChange={(e) => setHours(parseInt(e.target.value))}
            min={0}
            max={24}
          />
          <Input
            type="number"
            placeholder="Minutes"
            value={minutes}
            onChange={(e) => setMinutes(parseInt(e.target.value))}
            min={0}
            max={60}
          />
          <Input
            type="number"
            placeholder="Seconds"
            value={seconds}
            onChange={(e) => setSeconds(parseInt(e.target.value))}
            min={0}
            max={60}
          />
        </div>
        <div className="flex w-full flex-wrap gap-2">
          {durationPresets.map((duration) => (
            <Button
              key={duration}
              variant="outline"
              onClick={() => setHoursMinutesSeconds(duration * 60)}
              className="flex flex-grow"
            >
              {`${duration} min`}
            </Button>
          ))}
        </div>
        <div>
          <Button className="w-full" onClick={onSaveButtonSave}>
            Save
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

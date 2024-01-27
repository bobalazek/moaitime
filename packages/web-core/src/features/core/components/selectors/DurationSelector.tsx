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
      <PopoverContent className="flex w-[300px] flex-col gap-2 p-2" data-test="duration-selector">
        <div className="flex gap-2">
          <div className="flex flex-grow">
            <Input
              type="number"
              value={hours}
              onChange={(e) => setHours(parseInt(e.target.value))}
              min={0}
              max={24}
              className="px-1.5"
              aria-label="Hours"
            />
            <div className="text-muted-foreground flex items-center pl-1.5 text-sm">hrs</div>
          </div>
          <div className="flex flex-grow">
            <Input
              type="number"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value))}
              min={0}
              max={60}
              className="px-1.5"
              aria-label="Minutes"
            />
            <div className="text-muted-foreground flex items-center pl-1.5 text-sm">mins</div>
          </div>
          <div className="flex flex-grow">
            <Input
              type="number"
              value={seconds}
              onChange={(e) => setSeconds(parseInt(e.target.value))}
              min={0}
              max={60}
              className="px-1.5"
              aria-label="Seconds"
            />
            <div className="text-muted-foreground flex items-center pl-1.5 text-sm">secs</div>
          </div>
        </div>
        <h4 className="mt-2 text-center text-sm font-bold">Presets</h4>
        <div className="flex w-full flex-wrap gap-2">
          {durationPresets.map((duration) => (
            <Button
              key={duration}
              variant="outline"
              onClick={() => setHoursMinutesSeconds(duration * 60)}
              className="text-muted-foreground flex h-4 flex-grow px-2 py-3 text-xs"
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

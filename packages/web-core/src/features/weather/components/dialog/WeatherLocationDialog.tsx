import { useState } from 'react';

import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
} from '@myzenbuddy/web-ui';

import { useSettingsStore } from '../../../settings/state/settingsStore';
import { useWeatherStore } from '../../state/weatherStore';

export default function WeatherLocationDialog() {
  const {
    settings: { weatherLocation },
  } = useSettingsStore();
  const { locationDialogOpen, setLocationDialogOpen } = useWeatherStore();
  const [name, setName] = useState(weatherLocation);

  const onSaveButtonClick = async () => {
    // TODO

    setLocationDialogOpen(false);
  };

  return (
    <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
      <DialogContent data-test="weather--location-dialog">
        <DialogHeader>
          <DialogTitle>Location</DialogTitle>
          <DialogDescription>Set your weather location</DialogDescription>
        </DialogHeader>
        <div className="flex flex-grow">
          <Input
            className="flex-grow"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Location"
            data-test="weather--location-dialog--location-input"
          />
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Close
            </Button>
          </DialogClose>
          <Button type="submit" variant="default" onClick={onSaveButtonClick}>
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

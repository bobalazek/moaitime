import { useState } from 'react';

import {
  Alert,
  AlertDescription,
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
} from '@moaitime/web-ui';

import { useAuthStore } from '../../../auth/state/authStore';
import { useWeatherStore } from '../../state/weatherStore';
import { getWeatherLocation } from '../../utils/WeatherHelpers';

export default function WeatherLocationDialog() {
  const { auth, updateAccountSettings } = useAuthStore();
  const { locationDialogOpen, setLocationDialogOpen } = useWeatherStore();

  const weatherLocation = auth?.user?.settings?.weatherLocation ?? '';
  const weatherLocationLatitude = auth?.user?.settings?.weatherCoordinates?.latitude ?? 0;
  const weatherLocationLongitude = auth?.user?.settings?.weatherCoordinates?.longitude ?? 0;

  const [browserLocationError, setBrowserLocationError] = useState<string>();
  const [location, setLocation] = useState(weatherLocation);
  const [latitude, setLatitude] = useState(weatherLocationLatitude || '');
  const [longitude, setLongitude] = useState(weatherLocationLongitude || '');

  const onDetectLocationButtonClick = async () => {
    if (!navigator.geolocation) {
      setBrowserLocationError('Your browser does not support geolocation.');

      const possibleLocation = await getWeatherLocation();
      setLocation(possibleLocation ?? '');

      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const detectedLatitude = position.coords.latitude.toString();
        const detectedLongitude = position.coords.longitude.toString();

        setBrowserLocationError(undefined);
        setLatitude(detectedLatitude);
        setLongitude(detectedLongitude);

        const possibleLocation = await getWeatherLocation(detectedLatitude, detectedLongitude);
        setLocation(possibleLocation ?? '');
      },
      (error) => {
        setBrowserLocationError(error.message);
      }
    );
  };

  const onSaveButtonClick = async () => {
    updateAccountSettings({
      weatherLocation: location,
      weatherCoordinates: {
        latitude: Number(latitude),
        longitude: Number(longitude),
      },
    });

    setLocationDialogOpen(false);
  };

  return (
    <Dialog open={locationDialogOpen} onOpenChange={setLocationDialogOpen}>
      <DialogContent data-test="weather--location-dialog">
        <DialogHeader>
          <DialogTitle>Location</DialogTitle>
          <DialogDescription>Set your weather location</DialogDescription>
        </DialogHeader>
        <div className="flex flex-grow flex-col gap-2">
          <Input
            className="flex-grow"
            value={location}
            onChange={(event) => setLocation(event.target.value)}
            placeholder="Enter your location ..."
            data-test="weather--location-dialog--location-input"
          />
          <h3 className="mt-4 text-lg">Coordinates</h3>
          <div className="flex gap-2">
            <div className="flex flex-grow flex-col gap-2">
              <Label htmlFor="location-latitude">Latitude</Label>
              <Input
                id="location-latitude"
                value={latitude}
                onChange={(event) => setLatitude(event.target.value)}
                placeholder="Enter latitude ..."
                data-test="weather--location-dialog--latitude-input"
              />
            </div>
            <div className="flex flex-grow flex-col gap-2">
              <Label htmlFor="location-longitude">Longitude</Label>
              <Input
                id="location-longitude"
                value={longitude}
                onChange={(event) => setLongitude(event.target.value)}
                placeholder="Enter longitude ..."
                data-test="weather--location-dialog--longitude-input"
              />
            </div>
          </div>
          {browserLocationError && (
            <Alert variant="destructive">
              <AlertDescription>{browserLocationError}</AlertDescription>
            </Alert>
          )}
        </div>
        <DialogFooter>
          <Button type="button" variant="ghost" onClick={onDetectLocationButtonClick}>
            Detect Location
          </Button>
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

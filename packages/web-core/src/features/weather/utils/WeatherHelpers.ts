import { LocationInterface } from '@myzenbuddy/shared-common';

export const convertCelciusToFahrenheit = (celcius: number) => {
  return ((celcius * 9) / 5 + 32).toFixed(0);
};

export const convertKilometersPerHourToMilesPerHour = (kilometersPerHour: number) => {
  return (kilometersPerHour * 0.621371).toFixed(0);
};

export const getLocationsWithCoordinates = async (query: string): Promise<LocationInterface[]> => {
  const locations: LocationInterface[] = [
    {
      name: 'Veržej',
      latitude: 46.5833,
      longitude: 16.1667,
    },
  ];

  // TODO: do an actual request to the API

  return locations;
};

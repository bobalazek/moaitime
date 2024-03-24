import { ResponseInterface } from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

export const convertCelciusToFahrenheit = (celcius: number) => {
  return ((celcius * 9) / 5 + 32).toFixed(0);
};

export const convertKilometersPerHourToMilesPerHour = (kilometersPerHour: number) => {
  return (kilometersPerHour * 0.621371).toFixed(0);
};

export const getWeatherLocation = async (latitude?: string, longitude?: string) => {
  const url = new URL(`${API_URL}/api/v1/weather/location`);

  if (latitude && longitude) {
    url.searchParams.append('latitude', latitude);
    url.searchParams.append('longitude', longitude);
  }

  const response = await fetchJson<ResponseInterface<string>>(url.toString(), {
    method: 'GET',
  });

  return response.data;
};

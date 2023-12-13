import { WeatherInterface } from '@moaitime/shared-common';
import { create } from 'zustand';

export type WeatherStore = {
  /********** General **********/
  popoverOpen: boolean;
  setPopoverOpen: (popoverOpen: boolean) => void;
  weather: WeatherInterface | null;
  setWeather: (weather: WeatherInterface | null) => Promise<void>;
  // Location Dialog
  locationDialogOpen: boolean;
  setLocationDialogOpen: (locationDialogOpen: boolean) => void;
};

export const useWeatherStore = create<WeatherStore>()((set) => ({
  /********** General **********/
  popoverOpen: false,
  setPopoverOpen: (popoverOpen: boolean) => {
    set({
      popoverOpen,
    });
  },
  weather: null,
  setWeather: async (weather: WeatherInterface | null) => {
    set({ weather });
  },
  // Location Dialog
  locationDialogOpen: false,
  setLocationDialogOpen: (locationDialogOpen: boolean) => {
    set({
      locationDialogOpen,
    });
  },
}));

import { create } from 'zustand';

export type StatisticsStore = {
  /********** Statistics **********/
  view: string | null;
};

export const useStatisticsStore = create<StatisticsStore>()(() => ({
  /********** Statistics **********/
  view: null,
}));

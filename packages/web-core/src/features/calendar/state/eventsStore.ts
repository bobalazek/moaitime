import { create } from 'zustand';

import { CreateEvent, Event, UpdateEvent } from '@moaitime/shared-common';

import { addEvent, deleteEvent, editEvent, undeleteEvent } from '../utils/EventHelpers';
import { useCalendarStore } from './calendarStore';

export type CalendarStore = {
  addEvent: (data: CreateEvent) => Promise<Event>;
  editEvent: (eventId: string, data: UpdateEvent) => Promise<Event>;
  deleteEvent: (eventId: string) => Promise<Event>;
  undeleteEvent: (eventId: string) => Promise<Event>;
  // Selected
  selectedEventDialogOpen: boolean;
  selectedEvent: Event | null;
  setSelectedEventDialogOpen: (
    selectedEventDialogOpen: boolean,
    selectedEvent?: Event | null
  ) => void;
};

export const useEventsStore = create<CalendarStore>()((set) => ({
  addEvent: async (data: CreateEvent) => {
    const { reloadCalendarEntriesDebounced } = useCalendarStore.getState();

    const addedTask = await addEvent(data);

    await reloadCalendarEntriesDebounced();

    return addedTask;
  },
  editEvent: async (eventId: string, data: UpdateEvent) => {
    const { reloadCalendarEntriesDebounced } = useCalendarStore.getState();

    const editedTask = await editEvent(eventId, data);

    await reloadCalendarEntriesDebounced();

    return editedTask;
  },
  deleteEvent: async (eventId: string) => {
    const { reloadCalendarEntriesDebounced } = useCalendarStore.getState();

    const deletedTask = await deleteEvent(eventId);

    await reloadCalendarEntriesDebounced();

    return deletedTask;
  },
  undeleteEvent: async (eventId: string) => {
    const { reloadCalendarEntriesDebounced } = useCalendarStore.getState();

    const undeletedTask = await undeleteEvent(eventId);

    await reloadCalendarEntriesDebounced();

    return undeletedTask;
  },
  // Selected
  selectedEventDialogOpen: false,
  selectedEvent: null,
  setSelectedEventDialogOpen: (selectedEventDialogOpen: boolean, selectedEvent?: Event | null) => {
    set({
      selectedEventDialogOpen,
      selectedEvent,
    });
  },
}));

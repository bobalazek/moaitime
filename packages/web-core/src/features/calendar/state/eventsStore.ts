import { create } from 'zustand';

import { CreateEvent, Event, UpdateEvent } from '@moaitime/shared-common';

import { addEvent, deleteEvent, editEvent, undeleteEvent } from '../utils/EventHelpers';
import { useCalendarStore } from './calendarStore';

export type CalendarStore = {
  addEvent: (event: CreateEvent) => Promise<Event>;
  editEvent: (eventId: string, event: UpdateEvent) => Promise<Event>;
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
  addEvent: async (event: CreateEvent) => {
    const { loadCalendarEntries } = useCalendarStore.getState();

    const addedTask = await addEvent(event);

    await loadCalendarEntries();

    return addedTask;
  },
  editEvent: async (eventId: string, event: UpdateEvent) => {
    const { loadCalendarEntries } = useCalendarStore.getState();

    const editedTask = await editEvent(eventId, event);

    await loadCalendarEntries();

    return editedTask;
  },
  deleteEvent: async (eventId: string) => {
    const { loadCalendarEntries } = useCalendarStore.getState();

    const deletedTask = await deleteEvent(eventId);

    await loadCalendarEntries();

    return deletedTask;
  },
  undeleteEvent: async (eventId: string) => {
    const { loadCalendarEntries } = useCalendarStore.getState();

    const undeletedTask = await undeleteEvent(eventId);

    await loadCalendarEntries();

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

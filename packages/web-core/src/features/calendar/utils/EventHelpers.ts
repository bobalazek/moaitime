import { CreateEvent, Event, ResponseInterface, UpdateEvent } from '@moaitime/shared-common';
import { API_URL } from '@moaitime/shared-frontend';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Events **********/
export const addEvent = async (event: CreateEvent): Promise<Event> => {
  const response = await fetchJson<ResponseInterface<Event>>(`${API_URL}/api/v1/events`, {
    method: 'POST',
    body: JSON.stringify(event),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Event;
};

export const editEvent = async (eventId: string, event: UpdateEvent): Promise<Event> => {
  const response = await fetchJson<ResponseInterface<Event>>(
    `${API_URL}/api/v1/events/${eventId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(event),
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Event;
};

export const deleteEvent = async (eventId: string, isHardDelete?: boolean): Promise<Event> => {
  const response = await fetchJson<ResponseInterface<Event>>(
    `${API_URL}/api/v1/events/${eventId}`,
    {
      method: 'DELETE',
      body: isHardDelete ? JSON.stringify({ isHardDelete }) : undefined,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Event;
};

export const undeleteEvent = async (eventId: string): Promise<Event> => {
  const response = await fetchJson<ResponseInterface<Event>>(
    `${API_URL}/api/v1/events/${eventId}/undelete`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Event;
};

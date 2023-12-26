import { API_URL, CreateNote, Note, ResponseInterface } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Notes **********/
export const loadNotes = async () => {
  const response = await fetchJson<ResponseInterface<Note[]>>(`${API_URL}/api/v1/notes`, {
    method: 'GET',
  });

  return response.data as Note[];
};

export const addNote = async (note: CreateNote): Promise<Note> => {
  const response = await fetchJson<ResponseInterface<Note>>(`${API_URL}/api/v1/notes`, {
    method: 'POST',
    body: JSON.stringify(note),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Note;
};

export const editNote = async (noteId: string, note: Partial<Note>): Promise<Note> => {
  const response = await fetchJson<ResponseInterface<Note>>(`${API_URL}/api/v1/notes/${noteId}`, {
    method: 'PUT',
    body: JSON.stringify(note),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Note;
};

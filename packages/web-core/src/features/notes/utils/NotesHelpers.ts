import { API_URL, CreateNote, Note, ResponseInterface, UpdateNote } from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Notes **********/
export const loadNotes = async (): Promise<Note[]> => {
  const response = await fetchJson<ResponseInterface<Note[]>>(`${API_URL}/api/v1/notes`, {
    method: 'GET',
  });

  return response.data as Note[];
};

export const getNote = async (noteId: string): Promise<Note> => {
  const response = await fetchJson<ResponseInterface<Note>>(`${API_URL}/api/v1/notes/${noteId}`, {
    method: 'GET',
  });

  return response.data as Note;
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

export const editNote = async (noteId: string, note: UpdateNote): Promise<Note> => {
  const response = await fetchJson<ResponseInterface<Note>>(`${API_URL}/api/v1/notes/${noteId}`, {
    method: 'PATCH',
    body: JSON.stringify(note),
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Note;
};

export const deleteNote = async (noteId: string, isHardDelete?: boolean): Promise<Note> => {
  const response = await fetchJson<ResponseInterface<Note>>(`${API_URL}/api/v1/notes/${noteId}`, {
    method: 'DELETE',
    body: isHardDelete ? JSON.stringify({ isHardDelete }) : undefined,
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });

  return response.data as Note;
};

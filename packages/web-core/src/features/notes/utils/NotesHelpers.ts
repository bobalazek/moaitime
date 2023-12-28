import {
  API_URL,
  CreateNote,
  Note,
  NotesListSortFieldEnum,
  ResponseInterface,
  SortDirectionEnum,
  UpdateNote,
} from '@moaitime/shared-common';

import { fetchJson } from '../../core/utils/FetchHelpers';

/********** Notes **********/
export const loadNotes = async (options?: {
  search?: string;
  sortField?: NotesListSortFieldEnum;
  sortDirection?: SortDirectionEnum;
}): Promise<Note[]> => {
  const search = options?.search ?? '';
  const sortField = options?.sortField ?? NotesListSortFieldEnum.CREATED_AT;
  const sortDirection = options?.sortDirection ?? SortDirectionEnum.DESC;

  const url = new URL(`${API_URL}/api/v1/notes`);
  if (search) {
    url.searchParams.append('search', search);
  }

  if (sortField) {
    url.searchParams.append('sortField', sortField);
  }

  if (sortDirection) {
    url.searchParams.append('sortDirection', sortDirection);
  }

  const response = await fetchJson<ResponseInterface<Note[]>>(url.toString(), {
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

export const undeleteNote = async (noteId: string): Promise<Note> => {
  const response = await fetchJson<ResponseInterface<Note>>(
    `${API_URL}/api/v1/notes/${noteId}/undelete`,
    {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
    }
  );

  return response.data as Note;
};

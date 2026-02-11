import axios from "axios";
import { locale } from "../../utils/i18n";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1"
});

api.interceptors.request.use((config) => {
  config.headers["Accept-Language"] = locale.value;
  return config;
});

type JsonApiResource<T> = {
  id: string;
  type: string;
  attributes: T;
};

type JsonApiResponse<T> = {
  data: JsonApiResource<T> | JsonApiResource<T>[];
};

type NoteAttributes = {
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

export type Note = {
  id: number;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
};

const mapNote = (resource: JsonApiResource<NoteAttributes>): Note => ({
  id: Number(resource.id),
  ...resource.attributes
});

export const listNotes = async (): Promise<Note[]> => {
  const { data } = await api.get<JsonApiResponse<NoteAttributes>>("/notes");
  const resources = Array.isArray(data.data) ? data.data : [];
  return resources.map(mapNote);
};

export const createNote = async (payload: {
  title: string;
  content: string | null;
}): Promise<Note> => {
  const { data } = await api.post<JsonApiResponse<NoteAttributes>>("/notes", {
    note: payload
  });
  return mapNote(data.data as JsonApiResource<NoteAttributes>);
};

export const updateNote = async (
  id: number,
  payload: { title: string; content: string | null }
): Promise<Note> => {
  const { data } = await api.patch<JsonApiResponse<NoteAttributes>>(
    `/notes/${id}`,
    { note: payload }
  );
  return mapNote(data.data as JsonApiResource<NoteAttributes>);
};

export const deleteNote = async (id: number): Promise<void> => {
  await api.delete(`/notes/${id}`);
};

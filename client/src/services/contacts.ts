import { Query } from "@tanstack/react-query";
import { RequestBuilder, Page, QueryPageOptions, BACKEND_ORIGIN, logRequestResponse, handleApiError } from "services/backend";
import { Auth } from "services/auth";

export enum NumberType {
  WORK = "work",
  HOME = "home",
  MOBILE = "mobile",
}

export type Number = {
  type: NumberType;
  number: string;
}

export type Contact = {
  id: string;
  user: string;
  name: string;
  photo?: string;
  bio?: string;
  numbers: Number[];
}

type ContactSave = {
  name: string;
  photo?: string;
  bio?: string;
  numbers: Number[];
}

export type CreateContact = ContactSave;
export type UpdateContact = ContactSave & { id: string };

export const QueryKeys = {
  contacts: (user: string, query: string, size = 25): string[] => ["contact", user, query, `${size}`],
  contact: (id: string): string[] => ["contact", id],
  contactByNumber: (user: string, number: string): string[] => ["contact", user, number],
  predicate: (query: Query) => {
    return query.queryKey.includes("contact");
  }
}

export async function get(id: string): Promise<Contact> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/${id}`))
    .get().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Contact>())
}

export async function getByNumber(user: string, number: string): Promise<Contact> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/user/${user}/number/${number}`))
    .get().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Contact>())
}

export async function getAll(user: string, { query, number, size }: QueryPageOptions): Promise<Page<Contact>> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/user/${user}`)
      .param("search", query)
      .param("number", number)
      .param("size", size))
    .get().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Page<Contact>>())
}

export async function create(user: string, contact: CreateContact): Promise<Contact> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/user/${user}`))
    .post().bearer(token).bodyJson(contact).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Contact>())
}

export async function createBatch(user: string, contacts: CreateContact[]): Promise<Contact> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/user/${user}/batch`))
    .post().bearer(token).bodyJson(contacts).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Contact>())
}

export async function update(contact: UpdateContact): Promise<Contact> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/${contact.id}`))
    .put().bearer(token).bodyJson(contact).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Contact>())
}

export async function remove(id: string): Promise<void> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/${id}`))
    .delete().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .process();
}

export default {
  QueryKeys,
  getAll,
  get,
  getByNumber,
  create,
  createBatch,
  update,
  remove,
};

import { Query } from "@tanstack/react-query";
import { RequestBuilder, Page, QueryPageOptions, BACKEND_ORIGIN, logRequestResponse, handleApiError } from "./backend.ts";
import { Auth } from "./auth";

export enum NumberType {
  WORK = "work",
  HOME = "home",
  MOBILE = "mobile",
}

export type Number = {
  type: NumberType;
  number: string;
}

type ContactBase = {
  id: string;
  name: string;
  photo?: string;
  numbers: Number[];
}

export type Contact = ContactBase;
export type ContactDetails = ContactBase & { bio?: string };

type ContactSave = {
  name: string;
  photoUrl?: string;
  bio?: string;
  numbers: Number[];
}

export type CreateContact = ContactSave;
export type UpdateContact = ContactSave & { id: string };

export const QueryKeys = {
  contacts: (query: string, size = 25): string[] => ["contact", query, `${size}`],
  contact: (id: string): string[] => ["contact", id],
  featureCodes: (query: string): string[] => ["contact", "feature-codes", query],
  predicate: (query: Query) => {
    return query.queryKey.includes("contact");
  }
}

export async function get(id: string): Promise<ContactDetails> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/${id}`))
    .get().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<ContactDetails>())
}

export async function getAll({ query, number, size }: QueryPageOptions): Promise<Page<Contact>> {
  const { token, subject } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/user/${subject}`)
      .param("search", query)
      .param("number", number)
      .param("size", size))
    .get().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Page<Contact>>())
}

export async function create(contact: CreateContact): Promise<ContactDetails> {
  const { token, subject } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/user/${subject}`))
    .post().bearer(token).bodyJson(contact).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<ContactDetails>())
}

export async function update(contact: UpdateContact): Promise<ContactDetails> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/${contact.id}`))
    .put().bearer(token).bodyJson(contact).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<ContactDetails>())
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

export async function getFeatureCodes({ query, number, size }: QueryPageOptions): Promise<Page<Contact>> {
  const { token, subject } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/user/${subject}/feature-codes`)
      .param("search", query)
      .param("number", number)
      .param("size", size))
    .get().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Page<Contact>>())
}

export async function createBatch(contacts: CreateContact[]): Promise<Page<Contact>> {
  const { token, subject } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/contacts/user/${subject}/batch`))
    .post().bearer(token).bodyJson(contacts).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Page<Contact>>())
}

export default {
  QueryKeys,
  get,
  getAll,
  create,
  update,
  remove,
  getFeatureCodes,
  createBatch,
};

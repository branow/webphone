import { ensureAuthentication } from "./keycloak.ts";
import { Page, BACKEND_ORIGIN, PageOptions, RequestBuilder, logRequestResponse, handleApiError } from "./backend.ts";
import { Query } from "@tanstack/react-query";

export enum CallStatus {
  INCOMING = "incoming",
  OUTCOMING = "outcoming",
  MISSED = "missed",
  FAILED = "failed",
}

export type Contact = {
  id: string;
  name: string;
  photo?: string;
}

export type Record = {
  id: string;
  number: string;
  status: CallStatus;
  startDate: Date;
  endDate?: Date;
  contact?: Contact;
}

export type CreateRecord = {
  number: string;
  status: CallStatus;
  startDate: Date;
  endDate?: Date;
}

export const QueryKeys = {
  history: (size: number): string[] => ["history", size.toString()],
  historyByContact: (contact: string, size: number): string[] => 
    ["history", "contact", contact, size.toString()],
  predicate: (query: Query) => {
    return query.queryKey.includes("history");
  }
}

export async function getAll({ number, size }: PageOptions): Promise<Page<Record>> {
  const { token, subject } = await ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/history/user/${subject}`)
      .param("number", number)
      .param("size", size))
    .get().bearer(token).fetch();
  return await response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle(async res => mapRecordPage(await res.json<Page<Record>>()));
}

export async function getAllByContact(
  contactId: string, { number, size }: PageOptions
): Promise<Page<Record>> {
  const { token, subject } = await ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/history/user/${subject}/contact/${contactId}`)
      .param("number", number)
      .param("size", size))
    .get().bearer(token).fetch();
  return await response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle(async res => mapRecordPage(await res.json<Page<Record>>()));
}

export async function create(record: CreateRecord): Promise<Record> {
  const { token, subject } = await ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/history/user/${subject}`))
    .post().bearer(token).bodyJson(record).fetch();
  return await response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle(async res => mapRecord(await res.json<Record>()));
}

export async function remove(id: string): Promise<void> {
  const { token } = await ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/history/${id}`))
    .delete().bearer(token).fetch();
  return await response
    .any(logRequestResponse)
    .error(handleApiError)
    .process();
}

export async function removeAll(): Promise<void> {
  const { token, subject } = await ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/history/user/${subject}`))
    .delete().bearer(token).fetch();
  return await response
    .any(logRequestResponse)
    .error(handleApiError)
    .process();
}

function mapRecordPage(page: Page<any>): Page<Record> {
  const items = page.items.map(mapRecord);
  return { ...page, items };
}

function mapRecord(record: any): Record {
  return {
    ...record,
    startDate: new Date(record.startDate),
    endDate: record.endDate ? new Date(record.endDate) : undefined,
  }
}

export default {
  QueryKeys,
  getAll,
  getAllByContact,
  create,
  remove,
  removeAll,
};

import { Query } from "@tanstack/react-query";
import { Page, BACKEND_ORIGIN, PageOptions, RequestBuilder, logRequestResponse, handleApiError } from "services/backend";
import { Auth } from "services/auth";

export enum CallStatus {
  INCOMING = "incoming",
  OUTGOING = "outgoing",
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

export async function getAll(user: string, { number, size }: PageOptions): Promise<Page<Record>> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/history/user/${user}`)
      .param("number", number)
      .param("size", size))
    .get().bearer(token).fetch();
  await wait(1000);
  return await response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle(async res => mapRecordPage(await res.json<Page<Record>>()));
}

async function wait(time: number) {
  return new Promise<void>((resolve) => { setTimeout(() => { resolve() }, time); });
}

export async function getAllByContact(
  user: string,
  contactId: string,
  { number, size }: PageOptions,
): Promise<Page<Record>> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/history/user/${user}/contact/${contactId}`)
      .param("number", number)
      .param("size", size))
    .get().bearer(token).fetch();
  return await response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle(async res => mapRecordPage(await res.json<Page<Record>>()));
}

export async function create(user: string, record: CreateRecord): Promise<Record> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/history/user/${user}`))
    .post().bearer(token).bodyJson(record).fetch();
  return await response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle(async res => mapRecord(await res.json<Record>()));
}

export async function remove(id: string): Promise<void> {
  const { token } = await Auth().ensureAuthentication();
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

export async function removeAll(user: string): Promise<void> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/history/user/${user}`))
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

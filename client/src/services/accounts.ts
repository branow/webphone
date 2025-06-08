import { Query } from "@tanstack/react-query";
import { RequestBuilder, BACKEND_ORIGIN, logRequestResponse, handleApiError, QueryPageOptions, Page } from "services/backend";
import { Auth } from "services/auth";

export type Sip = {
  username: string;
  password: string;
  domain: string;
  proxy: string;
}

export type Account = {
  id: string;
  user: string;
  username: string;
  active: boolean;
  sip: Sip;
}

export type CreateAccount = {
  user: string;
  username: string;
  active: boolean;
  sip: Sip;
}

export type UpdateAccount = CreateAccount & { id: string; };

export const QueryKeys = {
  accounts: (query: string, size = 25): string[] => ["account", query, `${size}`],
  account: (id: string): string[] => ["account", id],
  accountActive: (user: string): string[] => ["account", "active", user],
  predicate: (query: Query) => { return query.queryKey.includes("account"); }
}

export async function get(id: string): Promise<Account> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/accounts/${id}`))
    .get().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Account>())
}

export async function getActive(user: string): Promise<Account> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/accounts/user/${user}/active`))
    .get().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Account>())
}

export async function getAll({ query, number, size }: QueryPageOptions): Promise<Page<Account>> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/accounts`)
      .param("search", query)
      .param("number", number)
      .param("size", size))
    .get().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Page<Account>>())
}

export async function create(account: CreateAccount): Promise<Account> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path("/api/accounts"))
    .post().bearer(token).bodyJson(account).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Account>())
}

export async function update(contact: UpdateAccount): Promise<Account> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/accounts/${contact.id}`))
    .put().bearer(token).bodyJson(contact).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Account>())
}

export async function remove(id: string): Promise<void> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/accounts/${id}`))
    .delete().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .process();
}

export default {
  QueryKeys,
  get,
  getActive,
  getAll,
  create,
  update,
  remove,
}

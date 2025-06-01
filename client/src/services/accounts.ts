import { Query } from "@tanstack/react-query";
import { RequestBuilder, BACKEND_ORIGIN, logRequestResponse, handleApiError } from "./backend.ts";
import { Auth } from "./auth";

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

export const QueryKeys = {
  account: (id: string): string[] => ["account", id],
  predicate: (query: Query) => { return query.queryKey.includes("account"); }
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

export async function get(user: string): Promise<Account> {
  const { token } = await Auth().ensureAuthentication();
  const response = await new RequestBuilder()
    .url(u => u
      .origin(BACKEND_ORIGIN)
      .path(`/api/accounts/user/${user}`))
    .get().bearer(token).fetch();
  return response
    .any(logRequestResponse)
    .error(handleApiError)
    .handle((res) => res.json<Account>())
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

export default {
  QueryKeys,
  getActive,
  get,
  create,
}

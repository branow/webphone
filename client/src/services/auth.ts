import { KeycloakService } from "../lib/keycloak";
import { AuthHeadersService } from "./authheaders";

const useAuthHeaders = import.meta.env.WEBPHONE_AUTH_HEADERS_URL;

export interface Authentication {
  token: string;
  subject: string;
}

export enum Role {
  Admin="admin",
  User="user",
}

export interface User {
  id: string;
  username: string;
  role: Role;
}

export interface AuthService {
  init: () => Promise<boolean>;
  login: () => Promise<boolean>;
  user: () => Promise<User>;
  ensureAuthentication: () => Promise<Authentication>;
}

let authService: AuthService;

export function Auth(): AuthService {
  if (!authService) authService = init();
  return authService;
}

function init(): AuthService {
  return useAuthHeaders ? AuthHeadersService() : KeycloakService();
}

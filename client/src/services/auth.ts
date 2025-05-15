import { KeycloakService } from "../lib/keycloak";
import { AuthHeadersService } from "./authheaders";

const useAuthHeaders = import.meta.env.WEBPHONE_AUTH_HEADERS_URL;

export interface Authentication {
  token: string;
  subject: string;
}

export interface AuthService {
  init: () => Promise<boolean>;
  login: () => Promise<boolean>;
  ensureAuthentication: () => Promise<Authentication>;
}

let authService: AuthService;

export function Auth(): AuthService {
  if (!authService) authService = init();
  return authService;
}

function init(): AuthService {
  console.log("url:" + useAuthHeaders);
  return useAuthHeaders ? AuthHeadersService() : KeycloakService();
}

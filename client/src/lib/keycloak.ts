import Keycloak from "keycloak-js";
import { Authentication, AuthService, Role, User } from "services/auth";
import { CONTEXT_PATH } from "routes";

let keycloak: Keycloak;

export function KeycloakService(): AuthService {
  return { init, login, ensureAuthentication, user }
}

async function init(): Promise<boolean> {
  if (!keycloak) {
    keycloak = new Keycloak({
      url: import.meta.env.WEBPHONE_KEYCLOAK_ORIGIN,
      realm: import.meta.env.WEBPHONE_KEYCLOAK_REALM,
      clientId: import.meta.env.WEBPHONE_KEYCLOAK_CLIENT_ID,
    });
  }
  if (!keycloak.didInitialize) {
    const auth = await keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: `${window.location.origin}${CONTEXT_PATH}/silent-check-sso.html`,
    });
    return auth;
  }
  return keycloak.authenticated!;
}

async function login(): Promise<boolean> {
  const authenticated = await init();
  if (!authenticated) {
    await keycloak.login({ redirectUri: currentUrl() });
  }
  return keycloak.authenticated!;
}

async function ensureAuthentication(): Promise<Authentication> {
  await login();

  await keycloak.updateToken(15);

  if (!keycloak.token || !keycloak.subject) {
    throw new Error("Missing token or subject after authentication");
  }

  return {
    token: keycloak.token!,
    subject: keycloak.subject!,
  };
}

interface KeycloakUser {
  sub: string;
  email_verified: boolean;
  name?: string;
  preferred_username?: string;
  given_name?: string;
  family_name?: string;
  email?: string;
}

async function user(): Promise<User> {
  await login();

  const user = (await keycloak.loadUserInfo()) as KeycloakUser;

  return {
    id: user.sub,
    username: user.preferred_username!,
    role: user.preferred_username === Role.Admin ? Role.Admin : Role.User,
  }
}

function currentUrl(): string {
  return window.location.href;
}

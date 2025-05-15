import Keycloak from "keycloak-js";
import { CONTEXT_PATH } from "../routes";
import { Authentication, AuthService } from "../services/auth";

let keycloak: Keycloak;

export function KeycloakService(): AuthService {
  return { init, login, ensureAuthentication }
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

function currentUrl(): string {
  return window.location.href;
}

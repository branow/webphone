import Keycloak from "keycloak-js";
import { CONTEXT_PATH } from "../routes";

const keycloak = new Keycloak({
    url: import.meta.env.WEBPHONE_KEYCLOAK_ORIGIN,
    realm: import.meta.env.WEBPHONE_KEYCLOAK_REALM,
    clientId: import.meta.env.WEBPHONE_KEYCLOAK_CLIENT_ID,
});

interface Authentication {
  token: string;
  subject: string;
}

export async function initKeycloak(): Promise<boolean> {
  if (!keycloak.didInitialize) {
    const auth = await keycloak.init({
      onLoad: "check-sso",
      silentCheckSsoRedirectUri: `${window.location.origin}${CONTEXT_PATH}/silent-check-sso.html`,
    });
    return auth;
  }
  return keycloak.authenticated!;
}

export async function login(): Promise<boolean> {
  const authenticated = await initKeycloak();
  if (!authenticated) {
    await keycloak.login({ redirectUri: currentUrl() });
  }
  return keycloak.authenticated!;
}

export async function ensureAuthentication(): Promise<Authentication> {
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

export default keycloak;

import { Authentication, AuthService, Role, User } from "services/auth";

const URL = import.meta.env.WEBPHONE_AUTH_HEADERS_URL;

const auth = {
  subject: "",
  username: "",
  token: "",
  groups: "",
}

export function AuthHeadersService(): AuthService {
  return { init, login, ensureAuthentication, user }
}

async function init(): Promise<boolean> {
  return login();
}

async function login(): Promise<boolean> {
  if (!isAuthenticated()) {
    return await fetchAuth();
  }
  return true;
}

async function ensureAuthentication(): Promise<Authentication> {
  if (!await login()) throw new Error("Cannot ensure authentication");
  return {
    token: auth.token,
    subject: auth.subject,
  };
}

async function user(): Promise<User> {
  if (!await login()) throw new Error("Cannot ensure authentication");
  return {
    id: auth.subject,
    username: auth.username,
    role: auth.username === Role.Admin ? Role.Admin : Role.User,
  };
} 

function isAuthenticated(): boolean {
  if (!auth.token) return false;
  try {
    const info = JSON.parse(atob(auth.token.split(".")[1]));
    const exp = (info.exp - 30) * 1000;  // exp - minus 30 secs and to milis.
    return exp > Date.now();
  } catch (e) {
    throw new Error("Invalid Access Token: " + e);
  }
}

async function fetchAuth(): Promise<boolean> {
  const res = await fetch(URL);
  auth.subject = res.headers.get("X-User")!;
  auth.username = res.headers.get("X-Preferred-Username")!;
  auth.groups = res.headers.get("X-Groups")!;
  auth.token = res.headers.get("X-Access-Token")!;
  return isAuthenticated();
}

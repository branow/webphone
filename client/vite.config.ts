import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig(() => {
  const expose = [
    "WEBPHONE_PROFILE",
    "WEBPHONE_CONTEXT_PATH",
    "WEBPHONE_BACKEND_ORIGIN",
    "WEBPHONE_AUTH_HEADERS_URL",
    "WEBPHONE_KEYCLOAK_ORIGIN",
    "WEBPHONE_KEYCLOAK_REALM",
    "WEBPHONE_KEYCLOAK_CLIENT_ID"
  ];
  return {
    base: process.env["WEBPHONE_CONTEXT_PATH"],
    define: expose.reduce((acc, key) => {
      acc[`import.meta.env.${key}`] = JSON.stringify(process.env[key] || "");
      return acc;
    }, {} as Record<string, string>),
    plugins: [ basicSsl() ]
  }
})

import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";

export default defineConfig(() => {
  const expose = [
    "WEBPHONE_PROFILE",
    "WEBPHONE_BACKEND_ORIGIN",
    "WEBPHONE_KEYCLOAK_ORIGIN",
    "WEBPHONE_KEYCLOAK_REALM",
    "WEBPHONE_KEYCLOAK_CLIEND_ID"
  ];
  return {
    define: expose.reduce((acc, key) => {
      acc[`import.meta.env.${key}`] = JSON.stringify(process.env[key] || "");
      return acc;
    }, {} as Record<string, string>),
    plugins: [ basicSsl() ]
  }
})

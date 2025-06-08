import { defineConfig } from "vite";
import basicSsl from "@vitejs/plugin-basic-ssl";
import wyw from "@wyw-in-js/vite";
import path from "path";

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

    plugins: [
      basicSsl(),
      wyw({
        include: ["**/*.{ts,tsx}"],
        babelOptions: {
          presets: ["@babel/preset-typescript", "@babel/preset-react"],
        },
      }),
    ],

    resolve: {
      alias: {
        components: path.resolve(__dirname, "src/components"),
        context: path.resolve(__dirname, "src/context"),
        hooks: path.resolve(__dirname, "src/hooks"),
        lib: path.resolve(__dirname, "src/lib"),
        pages: path.resolve(__dirname, "src/pages"),
        providers: path.resolve(__dirname, "src/providers"),
        services: path.resolve(__dirname, "src/services"),
        util: path.resolve(__dirname, "src/util"),
        styles: path.resolve(__dirname, "src/styles"),
        routes: path.resolve(__dirname, "src/routes"),
      },
    },
  }
})

# Webphone Project

Webphone is an app that facilitates real-time communication over the internet, designed with the familiar interface of a common smartphone.

The app includes:
- A **React softphone** intended for connecting to an Asterisk server.
- A **Spring Boot backend** for storing user information such as call history and address books.
- Integration with **Keycloak**, which is required for authentication.

## Requirements

- **JDK 21** or higher
- **Node.js 20** or higher (developed using Node.js 23)
- **Maven** (for backend builds)
- **Node Package Manager (NPM)** (for frontend builds)

## Getting Started

Before running the Webphone app, ensure the following components are set up:

- A **PBX server** (such as Asterisk or similar).
- An **authorization server** (such as Keycloak or similar).
- A **MongoDB database** for storing user data.

### 1. Environment Configuration

Create a `.env` file based on the example file `.env.example` to set up environment variables, or set them directly in your system if preferred.

#### Optional Environment Variables:
- `WEBPHONE_PROFILE`: Application profile (e.g., `dev`, `stage`, `prod`). Currently, only the `dev` profile is supported, which enables verbose logging and tools for test data generation (`/dev/test-data`).
- `WEBPHONE_SERVER_PORT`: The server port (default is `8080`).
- `WEBPHONE_CONTEXT_PATH`: The base path for the app (e.g., `/webphone` or leave empty for root).

#### Required Environment Variables:
- `WEBPHONE_FRONTEND_ORIGIN` and `WEBPHONE_BACKEND_ORIGIN`: The origins for the frontend and backend, respectively. Both have the same origin, but they are split into two environment variables to simplify the development process and allow future separation.
- `WEBPHONE_DB_URL`: MongoDB connection URL.
- `WEBPHONE_KEYCLOAK_ORIGIN`: The origin of the Keycloak server (used by the client).
- `WEBPHONE_KEYCLOAK_REALM`: The Keycloak realm (used by the client).
- `WEBPHONE_KEYCLOAK_CLIENT_ID`: The Keycloak client ID (used by the client).
- `WEBPHONE_ISSUER_URI`: The Keycloak issuer URI to validate JWT tokens (used by the backend).

> **Note:** Ensure that all environment variables are set up before building the app.

### 2. Starting the Application

To start the Webphone app, run the following command:

```bash
./script.sh start
```

This script will:
- Load environment variables from the `.env` file (if present).
- Check for the presence of required environment variables.
- Build both the backend and frontend.
- Create a `webphone` folder containing the executable JAR file.
- Start the executable JAR file.

### 3. Logs

Logs are stored in the `webphone/logs` folder. The current log file is named `webphone.log`, and a new log file is created each day. Older log files are named `webphone-{date}.log`.

### 4. Building the Project (Without Starting)

If you want to build the project without starting it immediately, you can use the following command:

```bash
./script.sh build
```

This command will build the backend and frontend, but will not start the application.

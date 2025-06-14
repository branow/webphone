# Web-Based Softphone System

A modern web softphone client with integrated contact and call history management.

---

## 1. Project Overview

This project delivers a **web-based softphone system**, empowering users to make and receive Voice over IP (VoIP) calls directly from their browser. It's a comprehensive app offering essential features like efficient call management, a personalized address book, and detailed call history tracking.

The system is built on a **decoupled architecture**, clearly separating the user interface from the data and business logic.
* The **frontend** is a standalone React application, serving as the intuitive user interface. It handles all direct client-side interactions, crucially managing WebRTC-based SIP signaling directly with the Asterisk PBX.
* The **backend** functions as a dedicated Java Spring Boot REST API server. Its primary role is to manage user data, execute business logic, and ensure robust data persistence in MongoDB.

To leverage specialized and robust solutions, we integrate with powerful external services. **Keycloak** manages secure user authentication and authorization, **Asterisk PBX** facilitates real-time SIP communication, and **MongoDB** acts as the primary data store. This decoupled and service-oriented approach boosts **scalability, maintainability, and flexibility**, allowing each component to evolve independently while benefiting from the stability and power of established third-party technologies.

The result is a pragmatic, efficient, and secure communication platform, designed for modern web deployment patterns and capable of leveraging best-of-breed technologies.

---

## 2. Features and Functionalities

Our web-based softphone system provides a rich set of features designed to offer a complete communication experience for end-users and streamlined management capabilities for administrators.

### What Can You Do With It?

Below are the core functionalities of the system. Each feature is designed for intuitive use and will be demonstrated with a quick GIF or video to show you exactly how it works.

* **User Authentication (via Keycloak)**
    * **Description:** Securely log in and out of the application using industry-standard OAuth2/OpenID Connect flows, managed by Keycloak. Your access is protected with JWT tokens.
    * **See it in action:** 

https://github.com/user-attachments/assets/d4a68626-08b5-4b5f-a204-eaa021b97e41

* **Call Management (Make & Receive)**
    * **Description:** Effortlessly **initiate SIP calls** by entering a phone number into the dialpad. The frontend handles all SIP signaling and WebRTC media negotiation with the Asterisk server. You'll also get instant notifications for **incoming SIP calls**, allowing you to accept, reject, mute, or hold conversations with a single click, ensuring you never miss an important interaction.
    * **See it in action:** 

https://github.com/user-attachments/assets/a6ea93fa-91de-488c-a34a-ea15cc18a578

* **Manage Contacts (Address Book)**
    * **Description:** Maintain a personal address book with comprehensive contact management.
        * **View Address Book:** Browse your list of contacts.
        * **Create Contact:** Add new contacts with details like name, multiple numbers, a bio, and even a profile photo.
        * **Read Contact:** View detailed information for any contact, including their associated call history.
        * **Update Contact:** Easily edit existing contact information.
        * **Delete Contact:** Remove contacts after confirmation.
    * **See it in action:**

https://github.com/user-attachments/assets/a5173403-638a-4774-9737-fb442b3e825d

* **Manage Call History**
    * **Description:** Keep track of all your communication with a detailed call history.
        * **View Call History:** See a chronological list of all your incoming, outgoing, and missed calls, grouped by date.
        * **Clear Call History:** Delete all or selected call records.
        * **Redial from History:** Quickly call back numbers directly from your call history.
    * **See it in action:**

https://github.com/user-attachments/assets/89deccde-0ca9-4ebc-99c7-444af8349a49

* **Settings Page**
    * **Description:** Customize your softphone experience with various settings.
        * **Theme Switching:** Choose between light and dark themes for optimal viewing comfort.
        * **Multi-Language Support:** Use the application in your preferred language.
    * **See it in action:**

https://github.com/user-attachments/assets/054bfe31-19d3-49fe-8298-003fce7a8fcc

* **SIP Account Credential Management (Administrator Function)**
    * **Description:** For administrators, the system provides tools to manage user SIP account credentials, including enabling, disabling, or editing SIP information.
    * **See it in action:**

https://github.com/user-attachments/assets/9f2ce884-cc42-4c1a-a89b-449907ac47fa

---

## 3. Technical Architecture

Our system is designed with a **decoupled, service-oriented approach**, prioritizing scalability, maintainability, and flexibility. It consists of distinct primary components, each with specialized responsibilities, interacting to form a robust communication platform.

### High-Level System Overview

At a glance, the architecture comprises a standalone **Frontend** application, a dedicated **Backend API**, and several essential **External Services** that provide core functionalities like authentication, SIP signaling, and data persistence.

### Core Components and Their Interactions

* **Frontend Component**
    * Operates as a **web-based softphone client**, providing the user interface.
    * Handles **SIP signaling directly through WebRTC** via the JsSIP library, connecting exclusively with the Asterisk PBX.
    * Interacts with the **Backend REST API** for managing user data (like address books and call history).

* **Backend Component**
    * Functions as a dedicated **REST API server** and serves static frontend assets.
    * Exposes **secured REST APIs** for data management operations (contacts, call history, photos).
    * **Validates JWT tokens** issued by Keycloak to enforce secure access control and strict separation of user data.
    * **Does not directly engage with the Asterisk PBX server**; all SIP signaling is performed by the frontend.

* **Keycloak**
    * An external, loosely coupled **authorization server**.
    * Manages **authentication and authorization** processes, issuing JWT tokens using standard OAuth2/OpenID Connect flows.
    * Tokens are consumed by the frontend and validated by the backend for secure access control.

* **Asterisk PBX Server**
    * Configured for **WebRTC support** via the PJSIP stack.
    * Handles **SIP signaling and media routing** for VoIP calls.
    * The **frontend directly establishes secure WebSocket (WSS) connections** with Asterisk, enabling real-time communication without backend involvement in the signaling path.

* **MongoDB Database**
    * Serves as the **primary data store**.
    * Persists contacts, call history records, and user-uploaded photos.
    * **Access is restricted exclusively to the backend**, which enforces access control based on the authenticated user's context.

### Communication Patterns and Security

All system interactions and data flows are designed with **security as a primary concern**.

* **Frontend → Keycloak:** User authentication requests are initiated from the frontend using the Keycloak-JS adapter.
* **Frontend → Backend:** Communications occur over **HTTPS** using RESTful APIs. Every API request is secured by validating the provided JWT token.
* **Frontend → Asterisk:** SIP signaling and media streaming are performed directly by the frontend over **secure WebSocket (WSS) connections**.
* **Backend → MongoDB:** The backend interacts with MongoDB for data management, with access tightly controlled and scoped to the authenticated user’s context.

While development and testing environments may use unsecured protocols for convenience, all production deployments mandate the use of **TLS/SSL encryption (HTTPS, WSS)** to protect data in transit, especially for WebRTC functionalities in modern browsers.

---

## 4. Getting Started Locally

This chapter provides comprehensive instructions for setting up and running the Web-Based Softphone System on your local development environment. You will configure and run each component distinctly, alongside the necessary external services.

The project source code is organized into two main folders: `client/` for the frontend React application and `server/` for the backend Java server. When the project is built, the compiled artifacts are placed into a top-level `build/` directory, containing `build/client/` and `build/server/`.

### 4.1. Prerequisites

Before you begin, ensure you have the following software installed on your machine:

* **Java Development Kit (JDK):** Version 21 or higher.
* **Node.js:** Version 20 or higher (development was primarily done using Node.js 23).
* **Maven:** For building the backend Java server.
* **Node Package Manager (NPM):** For building the frontend React application.
* **Docker** and **Docker Compose:** Recommended for easily setting up external services like MongoDB, Keycloak, and Asterisk.

### 4.2. External Services Setup

The application relies on three external services: MongoDB for data persistence, Keycloak for authentication/authorization, and Asterisk for SIP communication.

* **MongoDB (Version 4.x or higher recommended):**
    You can run MongoDB locally directly or via Docker. A simple way to get it running with Docker Compose (add this to a `docker-compose.yml` file):

    ```yaml
    version: '3.8'
    services:
      mongodb:
        image: mongo:4.4 # Or a newer stable version
        container_name: webphone_mongodb
        ports:
          - "27017:27017"
        volumes:
          - mongodb_data:/data/db
    volumes:
      mongodb_data:
    ```

    Start it using `docker-compose up -d mongodb`.

* **Keycloak (Version 26 or higher recommended):**
    Keycloak serves as the identity provider. It can also be run via Docker. You'll need to configure a Keycloak realm and client for the application. Refer to Keycloak's official documentation for detailed setup: [Keycloak Getting Started](https://www.keycloak.org/getting-started/getting-started-docker). Once running, configure your frontend and backend with its origin, realm, and client ID.
    **Note:** For local development, Keycloak might initially run on HTTP, but for production or if your frontend uses HTTPS, Keycloak should also be configured with SSL/TLS.

* **Asterisk PBX (Version 20 or higher recommended):**
    Asterisk handles all SIP signaling and WebRTC media.
    **CRITICAL:** For WebRTC sessions to function correctly in modern browsers, **Asterisk MUST be configured to use secure WebSocket (WSS) connections via TLS/SSL**. Browsers will block insecure WebRTC connections. You'll need to set up Asterisk with PJSIP and WebRTC support, including generating and configuring SSL certificates.
    For detailed instructions on configuring Asterisk for WebRTC clients, refer to the official documentation: [Configuring Asterisk for WebRTC Clients](https://docs.asterisk.org/Configuration/WebRTC/Configuring-Asterisk-for-WebRTC-Clients/)

### 4.3. Environment Configuration

The application uses environment variables for configuration. Create a `.env` file in the root of your project based on the `.env.example` file, or set these variables directly in your system.

**Required Environment Variables:**

* `WEBPHONE_FRONTEND_ORIGIN`: The full **HTTPS** origin (scheme + host + port) where your frontend application will be served (e.g., `https://localhost:3000`). This is crucial for **CORS** and frontend routing, and **MUST** use `https://` if WebRTC is to function.
* `WEBPHONE_BACKEND_ORIGIN`: The full origin of your backend API (e.g., `http://localhost:8080`). This is also critical for **CORS**. (Note: The backend can be HTTP, but frontend calls will likely come from HTTPS).
* `WEBPHONE_CONTEXT_PATH`: The base path for both the frontend and backend (e.g., `/app`). If set, your frontend will be served from `https://localhost:3000/app/` and your backend API will be accessible at `http://localhost:8080/app/api/`. Leave empty for root (`/`).
* `WEBPHONE_DB_URL`: The MongoDB connection URL (e.g., `mongodb://localhost:27017/webphone_db`).
* **Keycloak Client Configuration (used by Frontend):**
    * `WEBPHONE_KEYCLOAK_ORIGIN`: The origin of your Keycloak server. If your frontend is HTTPS, this should ideally be `https://` (e.g., `https://localhost:8081`).
    * `WEBPHONE_KEYCLOAK_REALM`: The Keycloak realm your application uses (e.g., `webphone-realm`).
    * `WEBPHONE_KEYCLOAK_CLIENT_ID`: The Keycloak client ID for your frontend (e.g., `webphone-client`).
* **Keycloak Issuer URI (used by Backend for JWT validation):**
    * `WEBPHONE_ISSUER_URI`: The Keycloak issuer URI for JWT token validation. If your Keycloak is HTTPS, this should be `https://` (e.g., `https://localhost:8081/realms/webphone-realm`).

**Optional Environment Variables:**

* `WEBPHONE_PROFILE`: Application profile (e.g., `dev`, `stage`, `prod`). The `dev` profile typically enables verbose logging and development tools.
* `WEBPHONE_SERVER_PORT`: The server port for the backend (default is `8080`).

**Note:** Ensure all required environment variables are correctly set before building and running the applications.

### 4.4. Building the Project Components

Navigate to the root directory of your cloned project. The `script.sh` utility simplifies the build process.

* **Build the Backend (Java Server):**
    ```bash
    ./script.sh build server
    ```
    This command compiles the Java source code from `server/` and packages the backend into an executable JAR file within the `build/server/` directory.

* **Build the Frontend (React App):**
    ```bash
    ./script.sh build client
    ```
    This command builds the React application from `client/`, generating optimized static assets into the `build/client/` directory.

### 4.5. Running the Backend Server

Once the backend is built and environment variables are loaded, you can start the Java server.

1.  **Load Environment Variables (if not already loaded in your shell session):**
    ```bash
    ./script.sh build env
    ```
    This step is crucial to ensure the backend picks up the correct environment variables, especially for database and Keycloak connections.

2.  **Start the Backend Server:**
    ```bash
    ./script.sh start server
    ```
    This command will start the Spring Boot application from `build/server/`, making the REST API available, typically on `http://localhost:8080` (or your configured `WEBPHONE_SERVER_PORT`).

### 4.6. Deploying the Frontend Application

After building the frontend using `./script.sh build client`, you'll have static HTML, CSS, and JavaScript files in `build/client/`. These files **MUST be served over HTTPS** by a web server (e.g., Nginx, Apache) for WebRTC functionality to work in modern browsers. You'll need to obtain and configure SSL/TLS certificates for your web server.

#### Example using Nginx with SSL/TLS:

1.  **Install Nginx:** Follow instructions for your operating system.
2.  **Obtain SSL Certificates:** For local development, you can use self-signed certificates or tools like mkcert. For production, use services like Let's Encrypt.
3.  **Configure Nginx:** Create an Nginx server block configuration (e.g., `/etc/nginx/sites-available/webphone.conf`):
    ```nginx
    server {
        listen 80;
        listen [::]:80;
        server_name localhost; # Or your domain
        return 301 https://$host$request_uri; # Redirect HTTP to HTTPS
    }

    server {
        listen 443 ssl;
        listen [::]:443 ssl;
        server_name localhost; # Or your domain

        ssl_certificate /etc/nginx/ssl/your_domain.crt; # Path to your SSL certificate
        ssl_certificate_key /etc/nginx/ssl/your_domain.key; # Path to your SSL key

        # IMPORTANT: Update this path to your project's build/client directory!
        root /path/to/your/project/build/client;
        index index.html;

        location / {
            try_files $uri $uri/ /index.html;
        }

        # If you are using WEBPHONE_CONTEXT_PATH (e.g., /app):
        # location /app/ {
        #     alias /path/to/your/project/build/client/;
        #     try_files $uri $uri/ /index.html;
        # }
    }
    ```
4.  **Enable Configuration:** Link your configuration to `sites-enabled` and restart Nginx.
    ```bash
    sudo ln -s /etc/nginx/sites-available/webphone.conf /etc/nginx/sites-enabled/
    sudo systemctl restart nginx
    ```
    Now, your frontend should be accessible securely at `https://localhost` (or your configured `WEBPHONE_FRONTEND_ORIGIN`). If `WEBPHONE_CONTEXT_PATH` is set, append it to the URL (e.g., `https://localhost/app`).

#!/bin/bash
set -uo pipefail

ACTION="${1:-}" # build or start
OBJECT="${2:-}" # client, server, env

function load_env() {
  if [[ -f ".env" ]]; then
    echo "Loading environment variables from .env file..."
    set -a
    source .env
    set +a
  else
    echo "No .env file found. Continuing with system environment variables..."
  fi
}

function check_env() {

  export WEBPHONE_PROFILE="${WEBPHONE_PROFILE:-prod}"
  export WEBPHONE_SERVER_PORT="${WEBPHONE_SERVER_PORT:-8080}"
  export WEBPHONE_CONTEXT_PATH="${WEBPHONE_CONTEXT_PATH:-}"

  # Required variables
  local missing_vars=()

  if [ -z "$WEBPHONE_AUTH_HEADERS_URL" ]; then
    for var in \
      WEBPHONE_KEYCLOAK_ORIGIN \
      WEBPHONE_KEYCLOAK_REALM \
      WEBPHONE_KEYCLOAK_CLIENT_ID; do
      if [[ -z "${!var:-}" ]]; then
        missing_vars+=("$var")
      fi
    done
  fi

  for var in \
    WEBPHONE_FRONTEND_ORIGIN \
    WEBPHONE_BACKEND_ORIGIN \
    WEBPHONE_DB_URL \
    WEBPHONE_ISSUER_URI; do
    if [[ -z "${!var:-}" ]]; then
      missing_vars+=("$var")
    fi
  done

  if [[ ${#missing_vars[@]} -gt 0 ]]; then
    echo "Missing required environment variables:"
    for var in "${missing_vars[@]}"; do
      echo "  - $var"
    done
    exit 1
  fi
}

function setup_env() {
  load_env
  check_env
}

function build_client() {
  setup_env

  echo "Cleaning build artifacts..."
  rm -rf build/client

  echo "Building client..."
  (cd client && npm install && npm run build)

  mkdir -p build/client

  echo "Copying client build to build/client..."
  cp -R client/dist/* build/client/
}

function build_server() {
  setup_env

  echo "Cleaning build artifacts..."
  rm -rf build/server

  echo "Building server..."
  (cd server && mvn clean install -DskipTests)

  mkdir -p build/server

  echo "Copying executable JAR to build/server..."
  cp server/target/webphone-*.jar build/server/

  echo "Server JAR was built successfully."
}

function build() {
  case "$OBJECT" in
    client) build_client ;;
    server) build_server ;;
    env) setup_env ;;
    *) build_client
      build_server;;
  esac
}

function start_server() {
  echo "Starting backend..."

  mkdir -p build

  local jar_file=$(cd build/server && ls webphone-*.jar 2>/dev/null | head -n 1)

  if [ -z "$jar_file" ]; then
    echo "JAR not found. Running build..."
    build_server
    jar_file=$(cd build/server && ls webphone-*.jar 2>/dev/null | head -n 1)
    if [ -z "$jar_file" ]; then
      echo "Build failed. Exiting."
      exit 1
    fi
  fi

  setup_env

  echo "Running build/server/$jar_file..."
  (cd build/server && java -jar "$jar_file")
}

function start() {
  case "$OBJECT" in
    client) echo "'start client' is not supported (check 'start server')"
      exit 1
      ;;
    server) start_server ;;
    env) setup_env ;;
    *) start_server;;
  esac
}

function doAction() {
  case "$ACTION" in
    build) build ;;
    start) start ;;
    *) echo "Usage: $0 {build|start} {client|server|env}"
      exit 1
      ;;
  esac
}

doAction

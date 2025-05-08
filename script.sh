#!/bin/bash
set -uo pipefail

ACTION="${1:-}" # build or start

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
  if [ -z "$WEBPHONE_PROFILE" ]; then
    echo "WEBPHONE_PROFILE not set, defaulting to 'prod'"
    export WEBPHONE_PROFILE="prod"
  fi

  if [ -z "$WEBPHONE_SERVER_PORT" ]; then
    echo "WEBPHONE_SERVER_PORT not set, defaulting to 8080"
    export WEBPHONE_SERVER_PORT="8080"
  fi

  if [ -z "$WEBPHONE_CONTEXT_PATH" ]; then
    echo "WEBPHONE_CONTEXT_PATH not set, using empty string"
    export WEBPHONE_CONTEXT_PATH=""
  fi

  # Required variables
  local missing_vars=()

  for var in \
    WEBPHONE_FRONTEND_ORIGIN \
    WEBPHONE_BACKEND_ORIGIN \
    WEBPHONE_DB_URL \
    WEBPHONE_KEYCLOAK_ORIGIN \
    WEBPHONE_KEYCLOAK_REALM \
    WEBPHONE_KEYCLOAK_CLIENT_ID \
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

  # Required vars
  [ -z "$WEBPHONE_FRONTEND_ORIGIN" ] && echo "WEBPHONE_FRONTEND_ORIGIN is required" && exit 1
  [ -z "$WEBPHONE_BACKEND_ORIGIN" ] && echo "WEBPHONE_BACKEND_ORIGIN is required" && exit 1
  [ -z "$WEBPHONE_DB_URL" ] && echo "WEBPHONE_DB_URL is required" && exit 1
  [ -z "$WEBPHONE_KEYCLOAK_ORIGIN" ] && echo "WEBPHONE_KEYCLOAK_ORIGIN is required" && exit 1
  [ -z "$WEBPHONE_KEYCLOAK_REALM" ] && echo "WEBPHONE_KEYCLOAK_REALM is required" && exit 1
  [ -z "$WEBPHONE_KEYCLOAK_CLIENT_ID" ] && echo "WEBPHONE_KEYCLOAK_CLIENT_ID is required" && exit 1
  [ -z "$WEBPHONE_ISSUER_URI" ] && echo "WEBPHONE_ISSUER_URI is required" && exit 1
}

function setup_env() {
  load_env
  check_env
}

function build() {
  echo "Building application..."
  setup_env

  echo "Building frontend..."
  (cd client && npm install && npm run build)


  local static_dir="server/src/main/resources/static"
  mkdir -p "$static_dir"

  echo "Copying frontend build to backend..."
  cp -R client/dist/* "$static_dir/"

  echo "Building backend..."
  (cd server && mvn clean install -DskipTests)

  mkdir -p webphone

  echo "Copying executable JAR to webphone/..."
  cp server/target/webphone-*.jar webphone/

  echo "Webphone JAR was built successfully."
}

function start() {
  echo "Starting application..."
  setup_env

  mkdir -p webphone

  local jar_file=$(cd webphone && ls webphone-*.jar 2>/dev/null | head -n 1)

  if [ -z "$jar_file" ]; then
    echo "JAR not found. Running build..."
    build
    jar_file=$(cd webphone && ls webphone-*.jar 2>/dev/null | head -n 1)
    if [ -z "$jar_file" ]; then
      echo "Build failed. Exiting."
      exit 1
    fi
  fi

  echo "Running webphone/$jar_file..."
  (cd webphone && java -jar "$jar_file")
}

case "$ACTION" in
  build) build ;;
  start) start ;;
  *) echo "Usage: $0 {build|start}" 
    exit 1
    ;;
esac

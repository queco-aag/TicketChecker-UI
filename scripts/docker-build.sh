#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: ./scripts/docker-build.sh [api_url] [api_timeout]"
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

API_URL="${1:-http://localhost:8080/api/v1}"
API_TIMEOUT="${2:-30000}"

export VITE_API_URL="$API_URL"
export VITE_API_TIMEOUT="$API_TIMEOUT"

echo "[UI] Building Docker image with docker compose"
echo "VITE_API_URL=$VITE_API_URL"
echo "VITE_API_TIMEOUT=$VITE_API_TIMEOUT"

# Detect docker compose command (new syntax vs old)
if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker compose"
else
  DOCKER_COMPOSE_CMD="docker-compose"
fi

echo "[UI] Using: $DOCKER_COMPOSE_CMD"
$DOCKER_COMPOSE_CMD build

echo "[UI] Build completed"


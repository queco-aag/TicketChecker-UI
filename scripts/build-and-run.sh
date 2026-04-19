#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: ./scripts/build-and-run.sh [api_url] [api_timeout]"
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

API_URL="${1:-http://localhost:8080/api/v1}"
API_TIMEOUT="${2:-30000}"

"$SCRIPT_DIR/docker-build.sh" "$API_URL" "$API_TIMEOUT"

echo "[UI] Starting docker compose"

# Detect docker compose command (new syntax vs old)
if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker compose"
else
  DOCKER_COMPOSE_CMD="docker-compose"
fi

echo "[UI] Using: $DOCKER_COMPOSE_CMD"
$DOCKER_COMPOSE_CMD up -d

echo "[UI] Running at http://localhost:3000"
echo "[UI] Logs: $DOCKER_COMPOSE_CMD logs -f"
echo "[UI] Stop: $DOCKER_COMPOSE_CMD down"


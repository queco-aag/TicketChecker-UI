#!/usr/bin/env bash
set -euo pipefail

if [[ "${1:-}" == "--help" || "${1:-}" == "-h" ]]; then
  echo "Usage: ./scripts/docker-up.sh"
  exit 0
fi

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
cd "$PROJECT_ROOT"

# Detect docker compose command
if docker compose version >/dev/null 2>&1; then
  DOCKER_COMPOSE_CMD="docker compose"
else
  DOCKER_COMPOSE_CMD="docker-compose"
fi

echo "[UI] Starting container with $DOCKER_COMPOSE_CMD"
$DOCKER_COMPOSE_CMD up -d

echo "[UI] Running at http://localhost:3000"
echo "[UI] Logs: $DOCKER_COMPOSE_CMD logs -f"
echo "[UI] Stop: $DOCKER_COMPOSE_CMD down"


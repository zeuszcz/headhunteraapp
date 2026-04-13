#!/usr/bin/env bash
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
# shellcheck disable=SC1091
source "${SCRIPT_DIR}/load-mcp-env.sh"

if [[ -z "${API_KEY:-}" && -n "${MAGIC_API_KEY:-}" ]]; then
  export API_KEY="${MAGIC_API_KEY}"
fi

if [[ -z "${API_KEY:-}" ]]; then
  echo "Missing API key for @21st-dev/magic." >&2
  echo "Set API_KEY or MAGIC_API_KEY in .cursor/mcp.secrets.env." >&2
  exit 1
fi

exec npx -y @21st-dev/magic@latest

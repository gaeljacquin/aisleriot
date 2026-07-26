#!/usr/bin/env bash
set -e
ni

if command -v zoxide >/dev/null 2>&1; then
  echo "Initializing zoxide history..."

  zoxide add /workspaces/aisleriot
fi

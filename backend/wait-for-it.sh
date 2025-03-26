#!/bin/sh
# https://github.com/vishnubob/wait-for-it

set -e

hostport="$1"
shift
timeout="${WAITFORIT_TIMEOUT:-30}"

while ! nc -z $(echo $hostport | tr ':' ' '); do
  sleep 1
  timeout=$((timeout - 1))

  if [ $timeout -eq 0 ]; then
    echo "Timeout waiting for $hostport" >&2
    exit 1
  fi
done

exec "$@"
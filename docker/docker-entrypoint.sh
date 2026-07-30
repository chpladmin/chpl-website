#!/bin/sh
set -e

# Non-secret default (today's hardcoded value) so a bare `docker run` still works
# for local testing; every real environment should set BACKEND_URLS (or the
# legacy single-value BACKEND_URL) explicitly.
: "${BACKEND_URLS:=${BACKEND_URL:-http://host.docker.internal:8181/chpl-service}}"

BALANCER_MEMBERS=""
OLD_IFS="$IFS"
IFS=','
for url in $BACKEND_URLS; do
    BALANCER_MEMBERS="${BALANCER_MEMBERS}    BalancerMember \"${url}\"
"
done
IFS="$OLD_IFS"
export BALANCER_MEMBERS

envsubst '${BALANCER_MEMBERS}' < /usr/local/apache2/conf/extra/proxy.conf.template > /usr/local/apache2/conf/extra/proxy.conf

# No default here - an unset API_KEY renders as an empty string, which
# src/app/api/api-key.js's getApiKey() already falls back on safely.
: "${API_KEY:=}"
export API_KEY

envsubst '${API_KEY}' < /usr/local/apache2/htdocs/env-config.js.template > /usr/local/apache2/htdocs/env-config.js

exec "$@"

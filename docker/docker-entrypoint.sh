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

# Per-instance routes (/rest1, /rest2, ...) so health checks and other tooling
# can target one specific backend directly, bypassing the load balancer -
# mirrors the legacy (non-GHCR) image's hardcoded /rest1 and /rest2 routes,
# but derived from BACKEND_URLS instead of baked-in IPs.
INDIVIDUAL_BACKEND_ROUTES=""
INDEX=1
IFS=','
for url in $BACKEND_URLS; do
    INDIVIDUAL_BACKEND_ROUTES="${INDIVIDUAL_BACKEND_ROUTES}ProxyPass \"/rest${INDEX}\" \"${url}\"
"
    INDEX=$((INDEX + 1))
done
IFS="$OLD_IFS"
export INDIVIDUAL_BACKEND_ROUTES

envsubst '${BALANCER_MEMBERS} ${INDIVIDUAL_BACKEND_ROUTES}' < /usr/local/apache2/conf/extra/proxy.conf.template > /usr/local/apache2/conf/extra/proxy.conf

# The consumer is browserInfo.slice.js, which reads
#   window.__env?.API_KEY ?? '<hardcoded default>'
# Because `??` only falls back on null/undefined, rendering an unset API_KEY as
# an empty string would win over that default and leave the app with no key at
# all. So when API_KEY is unset we emit only the namespace and leave the
# property undefined, letting the slice's default apply.
if [ -n "${API_KEY:-}" ]; then
    export API_KEY
    envsubst '${API_KEY}' < /usr/local/apache2/htdocs/env-config.js.template > /usr/local/apache2/htdocs/env-config.js
else
    printf 'window.__env = window.__env || {};\n' > /usr/local/apache2/htdocs/env-config.js
fi

# Safe default (localhost-only) so /server-status is never open to the world
# by accident; every real environment should set STATUS_ALLOWED_IPS to its
# monitoring agent's actual IP/CIDR.
: "${STATUS_ALLOWED_IPS:=127.0.0.1}"
export STATUS_ALLOWED_IPS

envsubst '${STATUS_ALLOWED_IPS}' < /usr/local/apache2/conf/extra/status.conf.template > /usr/local/apache2/conf/extra/status.conf

exec "$@"

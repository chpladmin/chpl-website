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
#
# When it is set, it goes into the template as a complete, pre-quoted JSON
# string literal rather than being interpolated between quotes in the template
# itself. A key containing a quote, backslash or newline would otherwise emit a
# syntactically broken env-config.js - taking the whole app down - or, with a
# crafted value, inject script into every page. There's no jq or python in
# httpd:2.4-alpine, so the escaping is busybox sed plus awk: backslashes first
# (so the escapes added after aren't themselves re-escaped), then quotes, tabs
# and carriage returns, with any embedded newlines folded to \n by awk.
if [ -n "${API_KEY:-}" ]; then
    API_KEY_JSON="\"$(printf '%s' "$API_KEY" \
        | sed -e 's/\\/\\\\/g' -e 's/"/\\"/g' -e 's/\t/\\t/g' -e 's/\r/\\r/g' \
        | awk 'BEGIN{ORS=""} NR>1{print "\\n"} {print}')\""
    export API_KEY_JSON
    envsubst '${API_KEY_JSON}' < /usr/local/apache2/htdocs/env-config.js.template > /usr/local/apache2/htdocs/env-config.js
else
    printf 'window.__env = window.__env || {};\n' > /usr/local/apache2/htdocs/env-config.js
fi

# Safe default (localhost-only) so /server-status is never open to the world
# by accident; every real environment should set STATUS_ALLOWED_IPS to its
# monitoring agent's actual IP/CIDR.
: "${STATUS_ALLOWED_IPS:=127.0.0.1}"
export STATUS_ALLOWED_IPS

envsubst '${STATUS_ALLOWED_IPS}' < /usr/local/apache2/conf/extra/status.conf.template > /usr/local/apache2/conf/extra/status.conf

# Set globally so httpd doesn't log AH00558 on every start, guessing an FQDN by
# reverse DNS. Same variable name the maintenance image takes, so one value can
# be passed to both containers.
: "${SERVER_NAME:=localhost}"
export SERVER_NAME

envsubst '${SERVER_NAME}' < /usr/local/apache2/conf/extra/servername.conf.template > /usr/local/apache2/conf/extra/servername.conf

exec "$@"

#!/bin/sh
set -e

# Non-secret default (today's hardcoded value) so a bare `docker run` still works
# for local testing; every real environment should set BACKEND_URL explicitly.
: "${BACKEND_URL:=http://host.docker.internal:8181/chpl-service}"
export BACKEND_URL

envsubst '${BACKEND_URL}' < /usr/local/apache2/conf/extra/proxy.conf.template > /usr/local/apache2/conf/extra/proxy.conf

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

exec "$@"

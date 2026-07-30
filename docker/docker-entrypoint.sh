#!/bin/sh
set -e

# Non-secret default (today's hardcoded value) so a bare `docker run` still works
# for local testing; every real environment should set BACKEND_URL explicitly.
: "${BACKEND_URL:=http://host.docker.internal:8181/chpl-service}"
export BACKEND_URL

envsubst '${BACKEND_URL}' < /usr/local/apache2/conf/extra/proxy.conf.template > /usr/local/apache2/conf/extra/proxy.conf

exec "$@"

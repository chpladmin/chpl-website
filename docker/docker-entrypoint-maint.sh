#!/bin/sh
set -e

# Hostname and admin contact for the maintenance vhosts. Neutral defaults so a
# bare `docker run` still works for local testing; real environments should set
# SERVER_NAME to the hostname they actually serve maintenance mode on.
: "${SERVER_NAME:=localhost}"
: "${SERVER_ADMIN:=chpl@ainq.com}"

# Safe default (localhost-only) so /server-status is never open to the world by
# accident - the same default, and the same variable name, the live image uses,
# so an environment can pass one value to both containers.
: "${STATUS_ALLOWED_IPS:=127.0.0.1}"

export SERVER_NAME SERVER_ADMIN STATUS_ALLOWED_IPS

# Rendered from pristine copies under conf-templates/ rather than substituted in
# place, so a container restart re-renders from source instead of finding the
# placeholders already consumed by the previous run.
#
# The explicit variable list matters: these files also reference Apache's own
# ${APACHE_LOG_DIR}, which is set by /etc/apache2/envvars at startup, not by us -
# naming only our three leaves it untouched for Apache to expand. Listing all
# three for every file is harmless; envsubst only substitutes what a file
# actually contains.
for conf in sites-available/000-default.conf \
            sites-available/001-error.conf \
            mods-enabled/status.conf; do
    envsubst '${SERVER_NAME} ${SERVER_ADMIN} ${STATUS_ALLOWED_IPS}' \
        < "/etc/apache2/conf-templates/${conf}" \
        > "/etc/apache2/${conf}"
done

exec "$@"

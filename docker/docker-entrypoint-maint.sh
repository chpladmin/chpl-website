#!/bin/sh
set -e

# Hostname and admin contact for the maintenance vhosts. Neutral defaults so a
# bare `docker run` still works for local testing; real environments should set
# SERVER_NAME to the hostname they actually serve maintenance mode on.
: "${SERVER_NAME:=localhost}"
: "${SERVER_ADMIN:=chpl@ainq.com}"
export SERVER_NAME SERVER_ADMIN

# Rendered from pristine copies under conf-templates/ rather than substituted in
# place, so a container restart re-renders from source instead of finding the
# placeholders already consumed by the previous run.
#
# The explicit variable list matters: these vhosts also reference Apache's own
# ${APACHE_LOG_DIR}, which is set by /etc/apache2/envvars at startup, not by us -
# naming only SERVER_NAME/SERVER_ADMIN leaves it untouched for Apache to expand.
for vhost in 000-default.conf 001-error.conf; do
    envsubst '${SERVER_NAME} ${SERVER_ADMIN}' \
        < "/etc/apache2/conf-templates/${vhost}" \
        > "/etc/apache2/sites-available/${vhost}"
done

exec "$@"

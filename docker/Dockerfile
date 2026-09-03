# Stage 1: Build the web application
FROM node:lts-alpine AS build-stage

WORKDIR /app

RUN corepack enable

# .yarnrc.yml (sets nodeLinker: node-modules) and the tracked .yarn/ subdirs must be
# present for this first install, or it silently runs under Yarn's default PnP linker
# instead - then `yarn build` fails later looking for a node-modules install-state
# file that was never created.
COPY package.json yarn.lock .yarnrc.yml ./
COPY .yarn ./.yarn
RUN yarn install

COPY . .
RUN yarn build --env.NODE_ENV=production

# Stage 2: Serve the built application with Apache2
FROM httpd:2.4-alpine

# bash: debugging; gettext: provides envsubst for entrypoint templating
RUN apk add --no-cache bash gettext

# Copy the built assets from the build stage
COPY --from=build-stage /app/dist /usr/local/apache2/htdocs/

# Backend target and API key are templated at container start (see
# docker-entrypoint.sh) instead of copied in statically, so the same image can
# point at any environment's backend/key without rebuilding.
COPY docker/apache-config/proxy.conf.template /usr/local/apache2/conf/extra/proxy.conf.template
COPY docker/apache-config/status.conf.template /usr/local/apache2/conf/extra/status.conf.template
COPY docker/env-config.template.js /usr/local/apache2/htdocs/env-config.js.template
COPY docker/docker-entrypoint.sh /usr/local/apache2/docker-entrypoint.sh
RUN chmod +x /usr/local/apache2/docker-entrypoint.sh

# Configure Apache to listen on a non-standard port (e.g., 3000)
# Create a custom httpd.conf to modify the Listen directive
RUN echo "Listen 3000" > /usr/local/apache2/conf/httpd.conf \
    && cat /usr/local/apache2/conf/original/httpd.conf >> /usr/local/apache2/conf/httpd.conf
RUN echo "Include conf/extra/proxy.conf" >> /usr/local/apache2/conf/httpd.conf
RUN echo "Include conf/extra/status.conf" >> /usr/local/apache2/conf/httpd.conf

# Duplicate access logging to stdout (alongside the default file-based log) so
# Datadog's container log collection picks up requests - mirrors the pattern
# QA/staging/production already get from their own (non-GHCR) Apache image.
RUN echo "CustomLog /proc/self/fd/1 combined" >> /usr/local/apache2/conf/httpd.conf

# The base image's stock httpd.conf leaves Timeout at Apache's 60s default,
# which is too short for some genuinely slow-but-legitimate backend endpoints
# (e.g. chpl-api's /developers/search can take 40-60s under real data volume) -
# mod_proxy_http was killing those with a 502 before the backend ever finished.
# Match the legacy (non-GHCR) Apache image's explicit "Timeout 600".
RUN echo "Timeout 600" >> /usr/local/apache2/conf/httpd.conf

# Expose the non-standard port
EXPOSE 3000

# Renders proxy.conf and env-config.js from their templates using the BACKEND_URL
# and API_KEY env vars, then starts Apache in the foreground
ENTRYPOINT ["/usr/local/apache2/docker-entrypoint.sh"]
CMD ["httpd-foreground"]

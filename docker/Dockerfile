# Stage 1: Build the web application
FROM node:lts-alpine AS build-stage

WORKDIR /app

RUN corepack enable
COPY package.json yarn.lock ./
RUN yarn install

COPY . .
RUN yarn build

# Stage 2: Serve the built application with Apache2
FROM httpd:2.4-alpine

# bash: debugging; gettext: provides envsubst for entrypoint templating
RUN apk add --no-cache bash gettext

# Copy the built assets from the build stage
COPY --from=build-stage /app/dist /usr/local/apache2/htdocs/

# Backend target is templated at container start (see docker-entrypoint.sh) instead
# of copied in statically, so the same image can point at any environment's backend.
COPY docker/apache-config/proxy.conf.template /usr/local/apache2/conf/extra/proxy.conf.template
COPY docker/docker-entrypoint.sh /usr/local/apache2/docker-entrypoint.sh
RUN chmod +x /usr/local/apache2/docker-entrypoint.sh

# Configure Apache to listen on a non-standard port (e.g., 3000)
# Create a custom httpd.conf to modify the Listen directive
RUN echo "Listen 3000" > /usr/local/apache2/conf/httpd.conf \
    && cat /usr/local/apache2/conf/original/httpd.conf >> /usr/local/apache2/conf/httpd.conf
RUN echo "Include conf/extra/proxy.conf" >> /usr/local/apache2/conf/httpd.conf

# Expose the non-standard port
EXPOSE 3000

# Renders proxy.conf from proxy.conf.template using the BACKEND_URL env var, then
# starts Apache in the foreground
ENTRYPOINT ["/usr/local/apache2/docker-entrypoint.sh"]
CMD ["httpd-foreground"]

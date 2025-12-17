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

# Install necessary tools for configuration (optional, but helpful for debugging)
RUN apk add --no-cache bash

# Copy the built assets from the build stage
COPY --from=build-stage /app/dist /usr/local/apache2/htdocs/

COPY apache-config/proxy.conf /usr/local/apache2/conf/extra/proxy.conf

# Configure Apache to listen on a non-standard port (e.g., 3000)
# Create a custom httpd.conf to modify the Listen directive
RUN echo "Listen 3000" > /usr/local/apache2/conf/httpd.conf \
    && cat /usr/local/apache2/conf/original/httpd.conf >> /usr/local/apache2/conf/httpd.conf
RUN echo "Include conf/extra/proxy.conf" >> /usr/local/apache2/conf/httpd.conf

# Expose the non-standard port
EXPOSE 3000

# Start Apache in the foreground
CMD ["httpd-foreground"]
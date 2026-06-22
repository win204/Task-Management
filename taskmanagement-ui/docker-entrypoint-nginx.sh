#!/bin/sh
# Inject BACKEND_HOST into the nginx config at container startup.
#
# Docker Compose: BACKEND_HOST=app:8080        (set in docker-compose.yml env)
# Kubernetes:     BACKEND_HOST=taskapp-service  (set in Deployment env)

set -e

BACKEND_HOST=${BACKEND_HOST:-app:8080}

echo "==> Starting Nginx with BACKEND_HOST=${BACKEND_HOST}"

# Use sed to safely substitute ${BACKEND_HOST} without touching Nginx's own $variables
sed "s|\${BACKEND_HOST}|${BACKEND_HOST}|g" \
    /etc/nginx/conf.d/nginx.conf.template \
    > /etc/nginx/conf.d/default.conf

echo "==> Generated /etc/nginx/conf.d/default.conf:"
cat /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'

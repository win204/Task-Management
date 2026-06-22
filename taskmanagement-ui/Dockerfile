# ─── Stage 1: Build React App ────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Dependency layer caching
COPY package.json package-lock.json ./
RUN npm ci

# Copy source
COPY . .

# VITE_API_BASE_URL is intentionally left empty ("") so Axios sends relative
# paths (e.g. /api/...) and Nginx proxies them to the backend at runtime.
# Docker Compose dev builds can override this with --build-arg.
ARG VITE_API_BASE_URL=
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ─── Stage 2: Serve with Nginx ───────────────────────────────────────────────
FROM nginx:1.27-alpine

# Install gettext for envsubst (kept as fallback, sed used in entrypoint)
RUN apk add --no-cache gettext

# Remove default config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy nginx config AS A TEMPLATE (contains ${BACKEND_HOST} placeholder)
COPY nginx.conf /etc/nginx/conf.d/nginx.conf.template

# Copy built React assets
COPY --from=build /app/dist /usr/share/nginx/html

# Copy and enable runtime entrypoint
COPY docker-entrypoint-nginx.sh /docker-entrypoint-nginx.sh
RUN chmod +x /docker-entrypoint-nginx.sh

EXPOSE 80

CMD ["/docker-entrypoint-nginx.sh"]

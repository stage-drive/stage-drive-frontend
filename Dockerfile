# --- deps: install dependencies ---
FROM node:22-alpine AS deps
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci

# --- dev: Vite dev server (docker build --target dev) ---
FROM deps AS dev
WORKDIR /app

COPY . .

EXPOSE 5173

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]

# --- build: compile static assets ---
FROM deps AS build
WORKDIR /app

COPY . .

RUN npm run build

# --- production: serve static assets with nginx ---
FROM nginx:1.27-alpine AS production

# The base image renders /etc/nginx/templates through envsubst on startup.
ENV NGINX_ENVSUBST_FILTER="^(BACKEND_URL|DNS_RESOLVER)$" \
    BACKEND_URL="http://backend:3000" \
    DNS_RESOLVER="127.0.0.11"

COPY nginx.conf.template /etc/nginx/templates/default.conf.template
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN printf 'export const environment = {\n  production: false,\n  supabaseUrl: "",\n  supabaseKey: "",\n};\n' \
    > src/environments/environment.ts && \
    printf 'export const environment = {\n  production: true,\n  supabaseUrl: (window as any).__env?.SUPABASE_URL ?? "",\n  supabaseKey: (window as any).__env?.SUPABASE_ANON_KEY ?? "",\n};\n' \
    > src/environments/environment.prod.ts

RUN npm run build -- --configuration=production

# Stage 2: Serve
FROM nginx:alpine

COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=builder /app/www /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "mkdir -p /usr/share/nginx/html/assets && printf 'window.__env={\"SUPABASE_URL\":\"%s\",\"SUPABASE_ANON_KEY\":\"%s\"};' \"$SUPABASE_URL\" \"$SUPABASE_ANON_KEY\" > /usr/share/nginx/html/assets/env.js && envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

# Stage 1: Build
FROM node:22-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN printf 'export const environment = {\n  production: true,\n  supabaseUrl: "%s",\n  supabaseKey: "%s",\n};\n' \
    "$SUPABASE_URL" "$SUPABASE_ANON_KEY" > src/environments/environment.ts && \
    cp src/environments/environment.ts src/environments/environment.prod.ts

RUN npm run build -- --configuration=production

# Stage 2: Serve
FROM nginx:alpine

COPY nginx.conf /etc/nginx/templates/default.conf.template

COPY --from=builder /app/www /usr/share/nginx/html

EXPOSE 80

CMD ["/bin/sh", "-c", "envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'"]

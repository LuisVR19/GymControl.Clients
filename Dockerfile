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
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

COPY --from=builder /app/www /usr/share/nginx/html

EXPOSE 80

CMD ["/entrypoint.sh"]

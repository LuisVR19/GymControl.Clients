#!/bin/sh
set -e

printf 'window.__env={"SUPABASE_URL":"%s","SUPABASE_ANON_KEY":"%s"};\n' \
    "$SUPABASE_URL" "$SUPABASE_ANON_KEY" \
    > /usr/share/nginx/html/assets/env.js

envsubst '$PORT' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf

exec nginx -g 'daemon off;'

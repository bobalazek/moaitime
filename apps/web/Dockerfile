# Base
FROM node:20-alpine AS base

# Builder
FROM base AS builder

WORKDIR /app

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
RUN npm install -g turbo

COPY . .

# This here is a bit of a chicken and egg problem. We want to install turbo with pnpm,
# but we need to run turbo prune to install the correct dependencies.
# For now we will just install it globally with npm above, and then for actual building,
# we will use the pnpm version of turbo.
RUN turbo prune @moaitime/web --docker

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@moaitime/web

# Runner
FROM nginx:1.25.3-alpine AS runner

WORKDIR /app

COPY ../../docker/web/nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=builder /app/out/full/apps/web/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

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
FROM base AS runner

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG WEB_PORT=4200
ENV WEB_PORT=$WEB_PORT

RUN npm install -g serve

COPY --from=builder /app/out/full/apps/web/dist ./

EXPOSE ${WEB_PORT}

CMD [ "sh", "-c", "serve . --listen ${WEB_PORT} --single" ]

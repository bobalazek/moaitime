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
RUN turbo prune @moaitime/api --docker

RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@moaitime/api
RUN pnpm --filter=@moaitime/api --prod deploy pruned

# Runner
FROM base AS runner

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

ARG API_PORT=3636
ENV API_PORT=$API_PORT

COPY --from=builder /app/.env ./.env
COPY --from=builder /app/.env.production ./.env.production
COPY --from=builder /app/pruned/dist .
COPY --from=builder /app/pruned/node_modules ./node_modules

EXPOSE ${API_PORT}

CMD ["node", "./main.js"]

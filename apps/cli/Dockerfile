# Base
FROM node:20 AS base

# Builder
FROM base AS builder

WORKDIR /app

ARG PROJECT=@moaitime/cli

RUN apk add --no-cache libc6-compat
RUN npm install -g pnpm
RUN npm install -g turbo

COPY . .

RUN turbo prune ${PROJECT} --docker
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --workspace-root --frozen-lockfile
RUN pnpm --filter=${PROJECT} --prod deploy pruned
RUN pnpm turbo run build --filter=${PROJECT}

# Runner
FROM base AS runner

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=$NODE_ENV

# Install PostgreSQL Client (pg_dump). Need for database backup. This is the only reason we are NOT using alpine image.
RUN apt-get update && apt-get install -y postgresql-client

COPY --from=builder /app/.env ./.env
COPY --from=builder /app/.env.production ./.env.production
COPY --from=builder /app/pruned/dist ./dist
COPY --from=builder /app/pruned/node_modules ./node_modules

RUN echo '#!/bin/sh' > /app/cli && \
    echo 'exec node /app/dist/main.js "$@"' >> /app/cli && \
    chmod +x /app/cli

HEALTHCHECK --interval=30s --timeout=15s CMD /app/cli health:check

ENTRYPOINT [ "/app/cli" ]

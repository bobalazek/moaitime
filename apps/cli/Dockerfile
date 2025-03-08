# Base
FROM node:20 AS base

# Builder
FROM base AS builder

WORKDIR /app

ARG PROJECT=@moaitime/cli

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN npm install -g corepack@latest
RUN corepack enable
RUN npm install -g turbo@2.1.3

COPY . .

RUN turbo prune ${PROJECT} --docker
RUN pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm turbo run build --filter=${PROJECT}
RUN pnpm --filter=${PROJECT} --prod deploy pruned

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

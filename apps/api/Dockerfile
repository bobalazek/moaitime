# Base
FROM node:20-alpine AS base

# Builder
FROM base AS builder

WORKDIR /app

ARG PROJECT=@moaitime/api

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN apk add --no-cache libc6-compat

RUN corepack enable
RUN npm install -g turbo@2.1.3

COPY . .

RUN turbo prune ${PROJECT} --docker
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile --ignore-scripts
RUN pnpm turbo run build --filter=${PROJECT}
RUN pnpm --filter=${PROJECT} --prod deploy pruned

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

HEALTHCHECK --interval=30s --timeout=15s CMD wget --no-verbose --tries=1 --spider http://localhost:${API_PORT}/api/health || exit 1

CMD ["node", "./main.js"]

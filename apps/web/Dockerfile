# Base
FROM node:20-alpine AS base

# Builder
FROM base AS builder

WORKDIR /app

ARG PROJECT=@moaitime/web

ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"

RUN corepack enable
RUN npm install -g turbo

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

ARG WEB_PORT=4200
ENV WEB_PORT=$WEB_PORT

RUN npm install -g serve

COPY --from=builder /app/pruned/dist .

EXPOSE ${WEB_PORT}

HEALTHCHECK --interval=30s --timeout=15s CMD wget --no-verbose --tries=1 --spider http://localhost:${WEB_PORT} || exit 1

CMD [ "sh", "-c", "serve . --listen ${WEB_PORT} --single" ]

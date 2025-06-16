FROM node:18-alpine AS base

FROM base AS builder
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@10.12.1 --activate
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN mkdir -p /pnpm
RUN pnpm add --global turbo
COPY . .
RUN turbo prune api --docker

FROM base AS installer
RUN apk update
RUN apk add --no-cache libc6-compat
WORKDIR /app
RUN corepack enable
RUN corepack prepare pnpm@10.12.1 --activate

# First install the dependencies (as they change less often)
COPY --from=builder /app/out/json/ .
RUN pnpm install

# Build the project
COPY --from=builder /app/out/full/ .
RUN pnpm turbo build

FROM base AS runner
WORKDIR /app

# Don't run production as root
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy the built application and all dependencies
COPY --from=installer --chown=nestjs:nodejs /app .

USER nestjs

EXPOSE 3001

CMD ["node", "apps/api/dist/main"]
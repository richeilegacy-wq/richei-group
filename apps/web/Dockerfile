# ──────────────────────────────────────────────
#  Richei-Group Web — Dockerfile (Next.js + Bun)
#  Build context: monorepo root
#  Coolify: Base Directory = /  |  Dockerfile Location = /apps/web/Dockerfile
# ──────────────────────────────────────────────

# ── Stage 1: Install ALL workspace dependencies ──
FROM oven/bun:1 AS base
WORKDIR /app

# Copy root workspace manifests & lockfile
COPY package.json bun.lock turbo.json tsconfig.json ./

# Copy ALL package/app manifests so Bun can resolve the full workspace graph
COPY packages/config/package.json ./packages/config/package.json
COPY packages/env/package.json    ./packages/env/package.json
COPY packages/db/package.json     ./packages/db/package.json
COPY packages/auth/package.json   ./packages/auth/package.json
COPY packages/api/package.json    ./packages/api/package.json
COPY apps/server/package.json     ./apps/server/package.json
COPY apps/web/package.json        ./apps/web/package.json

# Install all deps (including devDependencies needed for the build)
RUN bun install --frozen-lockfile

# ── Stage 2: Build ────────────────────────────
FROM base AS build
WORKDIR /app

# NEXT_PUBLIC_ env vars must be present at build time
ARG NEXT_PUBLIC_SERVER_URL
ENV NEXT_PUBLIC_SERVER_URL=$NEXT_PUBLIC_SERVER_URL

# Copy full source for workspace packages + web app
COPY packages/ ./packages/
COPY apps/web/ ./apps/web/

# Build Next.js (standalone output)
RUN cd apps/web && bun run build

# ── Stage 3: Production image ────────────────
FROM oven/bun:1-slim AS production
WORKDIR /app

ENV NODE_ENV=production
ENV HOSTNAME=0.0.0.0
ENV PORT=3000

# Copy Next.js standalone server
COPY --from=build /app/apps/web/.next/standalone ./

# Copy static assets and public files
COPY --from=build /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=build /app/apps/web/public ./apps/web/public

EXPOSE 3000

# Run the standalone Next.js server
CMD ["bun", "run", "apps/web/server.js"]

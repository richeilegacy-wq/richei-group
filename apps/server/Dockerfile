# ──────────────────────────────────────────────
#  Richei-Group Server — Dockerfile (Bun)
#  Build context: monorepo root (../../)
#  docker build -f apps/server/Dockerfile -t richei-server .
# ──────────────────────────────────────────────

# ── Stage 1: Install ALL workspace dependencies ──
FROM oven/bun:1 AS base
WORKDIR /app

# Copy root workspace manifests & lockfile
COPY package.json bun.lock turbo.json tsconfig.json ./

# Copy ALL package/app manifests so Bun can resolve the workspace graph
COPY packages/config/package.json ./packages/config/package.json
COPY packages/env/package.json    ./packages/env/package.json
COPY packages/db/package.json     ./packages/db/package.json
COPY packages/auth/package.json   ./packages/auth/package.json
COPY packages/api/package.json    ./packages/api/package.json
COPY apps/server/package.json     ./apps/server/package.json

# Install all deps (including devDependencies needed for the build)
RUN bun install --frozen-lockfile

# ── Stage 2: Build ────────────────────────────
FROM base AS build
WORKDIR /app

# Copy full source for workspace packages + server app
COPY packages/ ./packages/
COPY apps/server/ ./apps/server/

# Build the server (tsdown bundles workspace deps into dist/)
RUN cd apps/server && bun run build

# ── Stage 3: Production image ────────────────
FROM oven/bun:1-slim AS production
WORKDIR /app

ENV NODE_ENV=production

# Copy node_modules from the build stage (avoids lockfile mismatch with --production)
COPY --from=build /app/node_modules ./node_modules

# Copy built output from build stage
COPY --from=build /app/apps/server/dist ./apps/server/dist

EXPOSE 3000

# Run the built server bundle
CMD ["bun", "run", "apps/server/dist/index.mjs"]

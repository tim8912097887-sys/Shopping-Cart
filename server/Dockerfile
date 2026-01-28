FROM node:22-slim AS base
# Setup Pnpm
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable
WORKDIR /app

# Dependencies for Build
FROM base AS dev_dep
# Speed up build time by skip install if cache
COPY package.json pnpm-lock.yaml ./
# Lock file is source of truth when building image
# Create a cache mount id=pnpm and can access through /pnpm/store
RUN --mount=type=cache,id=pnpm,target=/pnpm/store  pnpm install --frozen-lockfile

# Build JS code from TS code
FROM dev_dep AS build
COPY . .
RUN pnpm build

# Production Pacakages
FROM base AS prod_dep
# Speed up build time by skip install if cache
COPY package.json pnpm-lock.yaml ./
# Only install dependencies
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --prod --frozen-lockfile

# Final stage
FROM base AS final
WORKDIR /app
# Copy dependencies from prod_dep stage
COPY --from=prod_dep /app/node_modules ./node_modules
# Copy compile code from build stage
COPY --from=build /app/dist ./dist

EXPOSE 3000

CMD ["node","dist/server.js"]

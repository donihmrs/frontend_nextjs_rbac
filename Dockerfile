# Base image with Bun
FROM oven/bun:1.3.1 AS base
WORKDIR /usr/src/app

# Stage: Install dev dependencies
FROM base AS install
RUN mkdir -p /temp/dev
WORKDIR /temp/dev
COPY package.json .
COPY bun.lock .
RUN bun install --frozen-lockfile

# Stage: Install production dependencies
RUN mkdir -p /temp/prod
WORKDIR /temp/prod
COPY package.json .
COPY bun.lock .
RUN bun install --frozen-lockfile --production

# Stage: Run tests (optional)
FROM base AS prerelease
WORKDIR /app
COPY --from=install /temp/dev/node_modules ./node_modules
COPY . .
ENV NODE_ENV=production
ENV TZ=Asia/Jakarta
ENV NEXT_PUBLIC_API_BASE_URL=https://api-rbac.tokocoding.com/api

# Stage: Final image for production
FROM oven/bun:1.3.1-alpine AS release
WORKDIR /app
COPY --from=install /temp/prod/node_modules ./node_modules
COPY --from=prerelease /app/.next .next
COPY --from=prerelease /app/public public
COPY --from=prerelease /app/package.json ./
COPY --from=prerelease /app/next.config.ts ./

EXPOSE 3000/tcp
ENTRYPOINT [ "bun", "run", "start" ]
# ---- Base stage ----
FROM oven/bun:1.3.1 AS base
WORKDIR /app

# Copy dependency files
COPY bun.lock package.json ./

# Install dependencies (gunakan tanpa --frozen-lockfile dulu)
RUN bun install

# Copy source code
COPY . .

# Build args & env
ENV NEXT_PUBLIC_API_BASE_URL=https://api-rbac.tokocoding.com/api

# Build Next.js app
RUN bun run next build

# ---- Production stage ----
FROM oven/bun:1.3.1 AS production
WORKDIR /app

COPY --from=base /app ./

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_BASE_URL=https://api-rbac.tokocoding.com/api

EXPOSE 3000
CMD ["bun", "run", "start"]

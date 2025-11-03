# ---- Base stage ----
FROM oven/bun:1.3.1 AS builder
WORKDIR /app

# Copy dependency files
COPY bun.lock package.json ./

# Install dependencies
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

# Copy hasil build dari stage sebelumnya
COPY --from=builder /app/.next .next
COPY --from=builder /app/public public
COPY --from=builder /app/package.json .

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_BASE_URL=https://api-rbac.tokocoding.com/api

EXPOSE 3000
CMD ["bun", "run", "start"]

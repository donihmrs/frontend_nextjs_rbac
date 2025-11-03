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
RUN bunx next build

# ---- Production stage ----
FROM oven/bun:1.3.1 AS production
WORKDIR /app

# Copy necessary runtime dependencies
COPY --from=builder /app/package.json ./
COPY --from=builder /app/bun.lockb ./
COPY --from=builder /app/next.config.ts ./

# Install only production deps
RUN bun install --production

# Copy entire .next build output (not just parts)
COPY --from=builder /app/.next .next
COPY --from=builder /app/public ./public

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_API_BASE_URL=https://api-rbac.tokocoding.com/api

EXPOSE 3000

CMD ["bunx", "next", "start", "-p", "3000"]

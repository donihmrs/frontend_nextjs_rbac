# =========================
# Stage 1: Build
# =========================
FROM oven/bun:1.3.1 AS builder
WORKDIR /app

# Copy dependency files
COPY bun.lockb* bun.lock* package.json ./
RUN bun install --frozen-lockfile

# Copy full project
COPY . .

# Build Next.js
ENV NODE_ENV=production
ENV NEXT_PUBLIC_API_BASE_URL=https://api-rbac.tokocoding.com/api
RUN bunx --bun next build

# =========================
# Stage 2: Run (production)
# =========================
FROM oven/bun:1.3.1-alpine AS runner
WORKDIR /app

# Copy build output and needed files
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/next.config.* ./
COPY --from=builder /app/bun.lock* ./

# Set env
ENV NODE_ENV=production
ENV TZ=Asia/Jakarta
ENV NEXT_PUBLIC_API_BASE_URL=https://api-rbac.tokocoding.com/api

EXPOSE 3000
CMD ["bun", "run", "start", "--", "-H", "0.0.0.0"]

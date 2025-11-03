# ---- Base stage ----
FROM oven/bun:1.3.1 AS base
WORKDIR /app

# Salin dependency file
COPY bun.lock package.json ./

# Install dependencies
RUN bun install --frozen-lockfile

# Salin semua source code
COPY . .

ENV NEXT_PUBLIC_API_BASE_URL=https://api-rbac.tokocoding.com/api

# Build Next.js app
RUN bun run build

# ---- Production stage ----
FROM oven/bun:1.3.1 AS production
WORKDIR /app

# Salin hasil build dari tahap sebelumnya
COPY --from=base /app ./

# Set environment
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# Jalankan Next.js dengan Bun
CMD ["bun", "run", "start"]

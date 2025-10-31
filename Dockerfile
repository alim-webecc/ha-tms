# --- Build Stage ---
FROM node:20-alpine AS builder
WORKDIR /app

# Build-Args erlauben (optional)
ARG DATABASE_URL
ENV DATABASE_URL=${DATABASE_URL}

# PNPM aktivieren
RUN corepack enable && corepack prepare pnpm@9.12.0 --activate

# Dependencies
COPY package.json pnpm-lock.yaml* pnpm-workspace.yaml* ./
RUN pnpm install --frozen-lockfile

# Code & Build
COPY . .
ENV NEXT_TELEMETRY_DISABLED=1
RUN pnpm build

# --- Runtime Stage ---
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=5000

# Nur nötige Artefakte
COPY --from=builder /app/package.json /app/pnpm-lock.yaml /app/pnpm-workspace.yaml ./
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/node_modules ./node_modules

EXPOSE 5000
CMD ["node", "node_modules/next/dist/bin/next", "start", "-p", "5000"]

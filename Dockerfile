FROM node:20-alpine AS base
RUN npm install -g pnpm turbo

FROM base AS builder
WORKDIR /app
COPY . .
RUN pnpm install --frozen-lockfile
RUN pnpm turbo run build --filter=@adsspot/web...

FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/web/node_modules ./apps/web/node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/apps/web/package.json ./apps/web/package.json

EXPOSE 3000
CMD ["pnpm", "--filter", "@adsspot/web", "start"]

# ===========================
# Dependencies stage
# ===========================
FROM node:21-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package*.json ./
RUN npm ci

# ===========================
# Build stage
# ===========================
FROM node:21-alpine AS builder
WORKDIR /app

# Accept build arguments for NEXT_PUBLIC variables
ARG NEXT_PUBLIC_API_BASE_URL=/api
ARG NEXT_PUBLIC_SECRET=1a9733d7738894c5

# Set them as environment variables for the build
ENV NEXT_PUBLIC_API_BASE_URL=$NEXT_PUBLIC_API_BASE_URL
ENV NEXT_PUBLIC_SECRET=$NEXT_PUBLIC_SECRET

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run build

# ===========================
# Production stage
# ===========================
FROM node:21-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy necessary files
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 80

CMD ["node", "server.js"]
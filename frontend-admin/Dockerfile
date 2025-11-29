# ===========================
# Build stage
# ===========================
FROM node:21-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# ===========================
# Production stage
# ===========================
FROM node:21-alpine
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=80

# Copy standalone output
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

EXPOSE 80

CMD ["node", "server.js"]
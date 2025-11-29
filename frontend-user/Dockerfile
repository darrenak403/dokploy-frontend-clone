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
# Production stage with Nginx
# ===========================
FROM nginx:alpine
WORKDIR /usr/share/nginx/html

# Remove default nginx config
RUN rm -rf /etc/nginx/conf.d/*

# Copy custom nginx config
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built files from Next.js
COPY --from=builder /app/out .

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# # ===========================
# # Build stage
# # ===========================
# FROM node:21-alpine AS builder
# WORKDIR /app

# COPY package*.json ./
# RUN npm install

# COPY . .
# RUN npm run build

# # ===========================
# # Run stage
# # ===========================
# FROM node:21-alpine
# WORKDIR /app

# COPY --from=builder /app ./

# EXPOSE 5174
# ENV PORT=5174
# ENV NODE_ENV=production

# CMD ["npm", "run", "start"]

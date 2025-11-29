FROM node:21-alpine
WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 5174
ENV PORT=5174
CMD ["npm", "run", "dev", "--", "--host", "--port", "5174"]

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

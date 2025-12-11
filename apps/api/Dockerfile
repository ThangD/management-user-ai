# Backend (NestJS API)
FROM node:22-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy source code
COPY . .

# Generate Prisma Client (needs dummy DATABASE_URL)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

# Build application
RUN npm run build

# Copy seed file to dist for production
RUN mkdir -p dist/prisma && cp prisma/seed.ts dist/prisma/seed.ts

# Production stage
FROM node:22-alpine

WORKDIR /app

# Install OpenSSL for Prisma
RUN apk add --no-cache openssl

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production && npm install prisma@^5.22.0

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client (needs dummy DATABASE_URL)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma

# Install ts-node for seed script
RUN npm install -g ts-node typescript

# Copy startup script
COPY start.sh ./
RUN chmod +x start.sh

# Expose port (Railway uses PORT env var)
EXPOSE 3001

# Remove healthcheck - Railway handles this externally
# HEALTHCHECK is not needed and can cause issues with Railway's deployment

# Start application with migrations
CMD ["./start.sh"]

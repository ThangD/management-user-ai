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

# Expose port
EXPOSE 3001

# Health check - Extended start period for migrations and seeding
HEALTHCHECK --interval=30s --timeout=10s --start-period=120s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Start application with migrations
CMD ["./start.sh"]

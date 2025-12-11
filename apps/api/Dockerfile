# Backend (NestJS API)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/api ./apps/api
COPY tsconfig.json ./

# Build application
WORKDIR /app/apps/api
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/api/package*.json ./apps/api/

# Install production dependencies only
RUN npm install --production

# Copy built application from builder
COPY --from=builder /app/apps/api/dist ./apps/api/dist

WORKDIR /app/apps/api

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "dist/main.js"]

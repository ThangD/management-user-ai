# Backend (NestJS API)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files from api directory
COPY apps/api/package*.json ./

# Install dependencies
RUN npm install

# Copy source code from api directory
COPY apps/api/ ./

# Build application
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY apps/api/package*.json ./
RUN npm install --production

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "dist/main.js"]

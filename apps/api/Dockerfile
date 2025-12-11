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
RUN npx prisma generate --schema=./prisma/schema.prisma

# Build application
RUN npm run build

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy package files and install production dependencies
COPY package*.json ./
RUN npm install --production

# Copy prisma schema
COPY prisma ./prisma

# Generate Prisma Client (needs dummy DATABASE_URL)
ENV DATABASE_URL="postgresql://dummy:dummy@localhost:5432/dummy"
RUN npx prisma generate --schema=./prisma/schema.prisma

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Expose port
EXPOSE 3001

# Start application
CMD ["node", "dist/main.js"]

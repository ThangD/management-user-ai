# Frontend (Next.js)
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Install dependencies
RUN npm install

# Copy source code
COPY apps/web ./apps/web

# Build application
WORKDIR /app/apps/web
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_GEMINI_API_KEY
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_GEMINI_API_KEY=$NEXT_PUBLIC_GEMINI_API_KEY
RUN npm run build

# Production stage
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY apps/web/package*.json ./apps/web/

# Install production dependencies only
RUN npm install --production

# Copy built application from builder
COPY --from=builder /app/apps/web/.next ./apps/web/.next
COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/next.config.js ./apps/web/
COPY --from=builder /app/apps/web/package.json ./apps/web/

WORKDIR /app/apps/web

# Expose port
EXPOSE 3000

# Start application
CMD ["npm", "start"]

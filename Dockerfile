# TrailLix Backend Dockerfile
FROM node:18-alpine AS base

# Install dependencies only when needed
FROM base AS deps
# Check https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine to understand why libc6-compat might be needed.
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci --only=production

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Install all dependencies (including devDependencies) for building
COPY package.json package-lock.json* ./
RUN npm ci

# Copy source code
COPY . .

# Set execute permissions for all binaries and generate Prisma Client
RUN chmod +x node_modules/.bin/* && npm exec prisma generate

# Build the application with verbose output
RUN npm run build 2>&1 || (echo "Build failed!" && exit 1)

# Debug: Show what was actually built
RUN echo "Contents of current directory:" && ls -la
RUN echo "Contents of dist directory:" && ls -la dist/ 2>/dev/null || echo "No dist directory found"
RUN echo "Looking for any .js files:" && find . -name "*.js" -type f | head -10

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs

# Copy the built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/prisma ./prisma

# Debug: Check what was copied
RUN ls -la dist/ || echo "dist directory not found in runner"

USER nestjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "dist/main"]

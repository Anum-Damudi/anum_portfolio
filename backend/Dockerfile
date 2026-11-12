# ==========================================
# Stage 1: Build stage
# ==========================================
FROM node:22-alpine AS builder

WORKDIR /app

# Install dependencies
COPY package*.json ./
COPY tsconfig.json ./
RUN npm ci

# Copy Prisma schema and generate client
COPY prisma ./prisma
RUN npx prisma generate

# Copy source code and build
COPY src ./src
COPY assets ./assets
RUN npm run build

# Prune dev dependencies for lean production image
RUN npm prune --production

# ==========================================
# Stage 2: Production Runner
# ==========================================
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy runtime files
COPY package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/assets ./assets

# Security: Non-root user
USER node

EXPOSE 5000

CMD ["node", "dist/server.js"]

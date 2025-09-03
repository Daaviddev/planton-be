# Multi-stage build for production optimization
FROM node:20-alpine AS base

# Install build dependencies including Rust toolchain
RUN apk add --no-cache \
    curl \
    build-base \
    openssl-dev \
    pkgconfig

# Install Rust toolchain
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Add WebAssembly target for wasm-pack
RUN rustup target add wasm32-unknown-unknown

# Install wasm-pack for WebAssembly builds
RUN cargo install wasm-pack

# Instead of using corepack, install pnpm + turbo directly from npm:
RUN npm install -g pnpm@latest turbo@latest

# Stage 2: Builder
FROM base AS builder

# Set working directory
WORKDIR /app

# Copy the monorepo files
COPY . .

# Prune the backend app for production
RUN turbo prune --scope=hyper-dyper-backend --docker

# Stage 3: Installer
FROM base AS installer

WORKDIR /app

# Copy .gitignore
COPY .gitignore .gitignore

# Copy pruned files from builder
COPY --from=builder /app/out/json/ ./
COPY --from=builder /app/out/pnpm-lock.yaml ./pnpm-lock.yaml

# Install production dependencies
RUN pnpm install

# Copy full source code
COPY --from=builder /app/out/full/ ./

# Copy turbo.json
COPY turbo.json turbo.json

# Run prisma generate
RUN pnpm --filter hyper-dyper-backend db:generate

# Build the BE app
RUN pnpm turbo build --filter=hyper-dyper-backend...

# Stage 4: Runner
FROM base AS runner

WORKDIR /app

# Copy built files from installer
COPY --from=installer /app .

# Copy entrypoint script from apps/gateway-backend/scripts directory
COPY apps/gateway-backend/scripts/entrypoint.sh ./

# Ensure the entrypoint script is executable
RUN chmod +x entrypoint.sh

# Create group and user 'nestjs'
RUN addgroup -S nestjs && adduser -S nestjs -G nestjs

# Change ownership of the app directory to the nestjs user
RUN chown -R nestjs:nestjs /app

# Switch to non-root user
USER nestjs

# Expose the application port
EXPOSE 3000

# Start the application using the entrypoint script
CMD ["./entrypoint.sh"]
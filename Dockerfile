# Build stage
FROM node:20.11-alpine AS builder

WORKDIR /app

# Install build dependencies
RUN apk add --no-cache \
    bash \
    git \
    jq \
    make

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy source code and build the application
COPY . .
RUN npm run build

# Production stage
FROM node:20.11-alpine AS production

LABEL maintainer="hftamayo" \
      version="0.1.4" \
      description="Node Todo API"  

# Set timezone to Central Time
ENV TZ=America/Chicago
RUN apk add --no-cache tzdata && \
    cp /usr/share/zoneinfo/$TZ /etc/localtime && \
    echo $TZ > /etc/timezone && \
    apk del tzdata

WORKDIR /app

# Install only production dependencies
COPY package*.json ./
RUN npm install --only=production

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@types ./node_modules/@types

# Configure production environment
ENV NODE_ENV=production

# Expose API port
EXPOSE 8021

# Start the application
CMD ["node", "dist/server.js"]

#how to run this file:
#docker build --no-cache --platform linux/amd64 -t hftamayo/nodetodo:<#>.<#>.<#>-<branch> .
#docker build --no-cache --platform linux/amd64 -t hftamayo/nodetodo:0.1.4-main .

#docker run --name nodetodo -p <port>:<port> -d --env-file .env hftamayo/nodetodo:<#>.<#>.<#>-<branch>
#docker run --name nodetodo -p 8021:8021 -d --env-file .env hftamayo/nodetodo:0.1.4-main
# Stage 1: Builder
FROM node:20-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies (including devDependencies if any)
RUN npm install

# Copy all application files
COPY . .

# Stage 2: Production
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install only production dependencies
RUN npm install --omit=dev

# Copy necessary files from builder stage
COPY --from=builder /app/public ./public
COPY --from=builder /app/models ./models
COPY --from=builder /app/server.js ./
COPY --from=builder /app/seed.js ./

# Create a non-root user and group for security
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Expose the application port
EXPOSE 3000

# Command to run the application
CMD ["npm", "start"]

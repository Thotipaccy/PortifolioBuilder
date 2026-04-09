# Use Node 20 as base image
FROM node:20-alpine

# Create app directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install --legacy-peer-deps

# Copy Prisma schema and config
COPY prisma ./prisma/
COPY prisma.config.ts ./

# Generate Prisma Client
RUN npx prisma generate

# Copy source code
COPY src ./src
COPY .env ./

# Expose port
EXPOSE 5000

# Start server and push DB
CMD ["sh", "-c", "npx prisma db push && npm start"]

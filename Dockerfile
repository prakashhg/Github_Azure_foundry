FROM node:22-alpine

# Create and switch to a non-root user
RUN addgroup -S appgroup && adduser -S appuser -G appgroup
USER appuser

# Set working directory
WORKDIR /app

# Copy only necessary files
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application files
COPY . ./

# Expose the application port
EXPOSE 3000

# Set environment variable for port
ENV PORT=3000

# Start the application
CMD ["npm", "start"]
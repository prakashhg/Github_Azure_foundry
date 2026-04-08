FROM node:22-alpine

# Create and set the working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy application source code
COPY . .

# Set the user to 'node' for security
USER node

# Expose the application port
EXPOSE 3000

# Set the default command to run the application
CMD ["npm", "start"]
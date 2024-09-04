# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if available)
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of your application code
COPY . .

# Build the TypeScript code
RUN npm run build

# Copy the public directory (which includes images) into the dist directory
COPY ./src/public ./dist/public

# Copy EJS templates to the dist directory
COPY ./src/templates ./dist/templates

# Expose the port the app runs on
EXPOSE 3000

# Define environment variable
ENV NODE_ENV=production

# Command to run your application
CMD ["node", "dist/index.js"]

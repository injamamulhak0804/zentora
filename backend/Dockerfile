# Use Node as the base
FROM node:22-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the code
COPY . .

# Expose the port your backend runs on (e.g., 8000)
EXPOSE 8000

# Start the server
CMD ["npm", "start"]
FROM node:20-alpine

WORKDIR /app

# Install dependencies first for better caching
COPY package*.json ./
RUN npm install --production

# Copy the rest of the backend source code
COPY . .

# Expose the port the API runs on
EXPOSE 5000

# Start the Node.js server
CMD ["npm", "start"]

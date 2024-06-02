# Choose the Node.js version
FROM mcr.microsoft.com/devcontainers/javascript-node:22

# Update packages and install curl and procps
RUN apt-get update && apt-get -y install curl procps

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package*.json ./

RUN npm ci

# Bundle app source
COPY . .

# Expose the port the app runs in
EXPOSE 3000

# Serve the app
CMD ["npm", "start"]
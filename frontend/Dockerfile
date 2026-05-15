FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
# Development target
CMD ["npm", "run", "dev"]
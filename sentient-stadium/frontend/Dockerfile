FROM node:20-alpine AS builder

WORKDIR /app
COPY package.json ./
# Running npm install
RUN npm install
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app ./
EXPOSE 3000 3001
CMD ["npm", "run", "start"]

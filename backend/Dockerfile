FROM node:20-alpine

RUN apk add --no-cache curl

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY src ./src

RUN mkdir -p data

EXPOSE 3001

CMD ["npm", "start"]

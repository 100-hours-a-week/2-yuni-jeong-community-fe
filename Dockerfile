FROM node:21-alpine
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build
COPY ./dist .
EXPOSE 3000
CMD ["node", "server.js"]
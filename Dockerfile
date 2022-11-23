FROM node:14-alpine
WORKDIR /usr/src/
COPY package*.json  ./
RUN npm install && npm cache clean --force
COPY . .
CMD ["npm", "run", "start"]

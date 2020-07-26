FROM node:12-alpine

WORKDIR /usr/app

COPY package*.json ./
RUN npm install --only=production
COPY ./src ./src
COPY sample.config.json /config/config.json

EXPOSE 7331
CMD [ "npm", "start" ]
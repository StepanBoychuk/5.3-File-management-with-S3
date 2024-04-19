FROM node:alpine

RUN npm i -g nodemon

COPY . /app

WORKDIR /app

RUN npm install

CMD ["npm", "start:dev"]
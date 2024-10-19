FROM node:20.17.0

RUN mkdir spotec-server

WORKDIR /spotec-server

COPY . .

RUN npm i pm2 -g

RUN npm i

EXPOSE 5000
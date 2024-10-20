FROM node:20.17.0

RUN mkdir spotec-server

WORKDIR /spotec-server

COPY . .

RUN npm i

RUN cd ..

RUN mkdir assets

EXPOSE 8000
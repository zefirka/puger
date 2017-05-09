FROM node:7.4

RUN mkdir /app
WORKDIR /app

ADD . /app/

ENV DEBUG=1

RUN npm install
RUN npm install -g webpack
RUN webpack

CMD npm start $PORT ./templates

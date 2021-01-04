FROM  node

WORKDIR /app
COPY package.json /app
COPY yarn.lock /app
RUN  yarn install

ADD ./ dist
RUN yarn build
EXPOSE 3000
CMD [ "yarn","start:dev" ]

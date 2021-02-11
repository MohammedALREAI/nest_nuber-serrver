FROM node:latest
WORKDIR /nuber_eats
COPY package.json ./
COPY yarn.lock ./
COPY . /nuber_eats
RUN  yarn install
RUN yarn build
COPY dist ./
RUN yarn build
EXPOSE 4000
CMD [ "yarn","start:dev" ]

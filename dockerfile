FROM node:10
WORKDIR /app
COPY . .
RUN yarn install && yarn build
ENTRYPOINT ["yarn", "start"]
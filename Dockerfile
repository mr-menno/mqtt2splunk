FROM node:11-alpine
COPY . /app/
WORKDIR /app
RUN yarn install
CMD ["npm","start"]

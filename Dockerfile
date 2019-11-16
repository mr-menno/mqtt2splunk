FROM node:11-alpine
COPY src /app
WORKDIR /app
RUN yarn install
CMD ["npm","start"]
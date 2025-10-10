FROM node:21-alpine

WORKDIR /app

RUN apk --no-cache add --update \
    git \
    openssh \
    build-base \
    && rm -rf /var/cache/apk/*

COPY . .

RUN npm install -g nodemon

RUN npm install

EXPOSE 3000
CMD ["sh", "-c", "npm run typeorm migration:run -- -d ./src/lib/database.ts && npm run seed && npm start"]

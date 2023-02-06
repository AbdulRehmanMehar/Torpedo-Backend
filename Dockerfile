# Installs Node.js image
FROM node:18.12.1-alpine

# sets the working directory for any RUN, CMD, COPY command
# all files we put in the Docker container running the server will be in /usr/src/app (e.g. /usr/src/app/package.json)
WORKDIR /usr/src/app

RUN npm config set cache /usr/src/app --global

RUN npm i -g tslint typescript cpy-cli nodemon sequelize-cli cpy-cli cross-env lodash

# Copies package.json, package-lock.json, tsconfig.json, .env to the root of WORKDIR
COPY ["tslint.json", "package.json", ".sequelizerc", "nodemon.json", "tsconfig.json", ".env", "./"]

RUN NODE_ENV=development npm install

COPY ./src ./src

RUN npm run build

# Copies everything in the src directory to WORKDIR/src
COPY ./dist ./dist

# Runs the dev npm script to build & start the server
CMD npm run db:migrate:prod && npm run start
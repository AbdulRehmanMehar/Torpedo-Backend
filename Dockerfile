# Installs Node.js image
FROM node:18.12.1-alpine

# sets the working directory for any RUN, CMD, COPY command
# all files we put in the Docker container running the server will be in /usr/src/app (e.g. /usr/src/app/package.json)
WORKDIR /usr/src/app

# Copies package.json, package-lock.json, tsconfig.json, .env to the root of WORKDIR
COPY ["tslint.json", "package.json", "yarn.lock", ".sequelizerc", "nodemon.json", "tsconfig.json", ".env", "./"]

# Copies everything in the src directory to WORKDIR/src
COPY ./src ./src

RUN npm config set cache /usr/src/app --global

RUN yarn global add tslint typescript cpy-cli nodemon sequelize-cli cpy-cli cross-env lodash

# Installs all packages
RUN NODE_ENV=development yarn install --production=false

# Runs the dev npm script to build & start the server
CMD yarn db:migrate && yarn dev
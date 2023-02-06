# Installs Node.js image
FROM node:18.12.1

# sets the working directory for any RUN, CMD, COPY command
# all files we put in the Docker container running the server will be in /usr/src/app (e.g. /usr/src/app/package.json)
WORKDIR /usr/src/app

ADD https://github.com/ufoscout/docker-compose-wait/releases/download/2.9.0/wait /wait
RUN chmod +x /wait

# Copies package.json, package-lock.json, tsconfig.json, .env to the root of WORKDIR
COPY ["tslint.json", "package.json", "yarn.lock", ".sequelizerc", "nodemon.json", "tsconfig.json", ".env", "./"]

# Copies everything in the src directory to WORKDIR/src
COPY ./src ./src

RUN npm config set cache /usr/src/app --global

# Installs all packages
RUN yarn

# Runs the dev npm script to build & start the server
CMD /wait && yarn db:migrate && yarn dev
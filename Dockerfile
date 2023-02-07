FROM node:18.12.1-alpine

WORKDIR /usr/src/app

RUN npm config set cache /usr/src/app --global

RUN npm i -g npm@latest

RUN npm i -g tslint typescript cpy-cli nodemon sequelize-cli cpy-cli cross-env lodash dotenv

COPY ["package.json", "./"]

RUN npm install

RUN npm install dotenv

RUN npm install --dotenv-extended 

COPY . .

RUN npm run build

CMD ["npm", "start" ]
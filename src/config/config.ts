import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config({
  path: __dirname + '/./../../.env'
});

const {
  DB_HOST,
  DB_NAME,
  DB_PORT,
  DB_ADMIN_USER,
  DB_ADMIN_PASSWORD,
  DATABASE_CERTIFICATE
} = process.env;

const config: any = {
  development: {
    username: DB_ADMIN_USER,
    password: DB_ADMIN_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
  },
  test: {
    username: DB_ADMIN_USER,
    password: DB_ADMIN_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
  },
  production: {
    username: DB_ADMIN_USER,
    password: DB_ADMIN_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
  },
}

const data = JSON.stringify(config);

try {
  writeFileSync('./dist/config/config.json', `${data}`);
} catch (error) {
  console.log('error while writing data', error);
}
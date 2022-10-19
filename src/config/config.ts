import dotenv from 'dotenv';
import { writeFileSync } from 'fs';

dotenv.config({
  path: __dirname + '/./../../.env'
});

const {
  DB_HOST,
  DB_NAME,
  DB_ADMIN_USER,
  DB_ADMIN_PASSWORD,
} = process.env;

const config: any = {
  development: {
    username: DB_ADMIN_USER,
    password: DB_ADMIN_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  test: {
    username: DB_ADMIN_USER,
    password: DB_ADMIN_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  },
  production: {
    username: DB_ADMIN_USER,
    password: DB_ADMIN_PASSWORD,
    database: DB_NAME,
    host: DB_HOST,
    dialect: 'mysql',
    dialectOptions: {
      ssl: {
        rejectUnauthorized: false
      }
    }
  }
}

const data = JSON.stringify(config);

try {
  writeFileSync('./dist/config/config.json', `${data}`);
} catch (error) {
  console.log('error while writing data', error);
}
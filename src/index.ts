import * as dotEnv from 'dotenv';
dotEnv.config();

import 'reflect-metadata'; // this shim is required
import { sequelize } from './config/db';
import { createExpressServer, Action } from 'routing-controllers';
const { createLogger, format, transports } = require('winston');

import { IndexController } from './controllers';
import { HelmetMiddleware } from './middlewares';



// Express Server Setup
const loglevel = process.env.LOGLEVEL || 'info';
const port = process.env.PORT || 1337;
const jwtKey = process.env.JWTKEY || 'complexKey';
const logDir = process.env.LOGDIR || './log';
const environment = process.env.ENV || 'development'
const useProd = environment === 'production' ? true : false;
const logger = createLogger();

// Setup Server
const app = createExpressServer({
  errorOverridingMap: {
   ForbiddenError: {
     message: 'Access is denied'
   }
  },
  middlewares: [HelmetMiddleware],
  controllers: [IndexController]
});
app.listen(port, async () => {
  logger.log(
    {
     level: 'info',
     message: `SERVER: Server running on: ${port}`
    }
   );

  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

});
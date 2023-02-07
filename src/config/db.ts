import * as allModels from '../models';
import { Sequelize } from 'sequelize-typescript';
const {
  DB_HOST,
  DB_NAME,
  DB_TENANT_USER,
  DB_TENANT_PASSWORD,
  DB_ADMIN_USER,
  DB_ADMIN_PASSWORD,
} = process.env;

const connection: Record<string, Record<'isConnected', boolean>> = {};
export const connectToDatabase = async (tenantId: string | 'admin') => {
  let sequelize = new Sequelize(DB_NAME, DB_TENANT_USER, DB_TENANT_PASSWORD, {
    host: DB_HOST,
    dialect: 'postgres',
    pool: {
      min: 0,
      max: 5,
    },
  });

  if (tenantId === 'admin') {
    sequelize = new Sequelize(DB_NAME, DB_ADMIN_USER, DB_ADMIN_PASSWORD, {
      host: DB_HOST,
      dialect: 'postgres',
      pool: {
        min: 0,
        max: 5,
      }
    });
    sequelize.query(
      `GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO "${DB_TENANT_USER}";`
    );
  }

  sequelize.addModels([...Object.values(allModels)])

  if (tenantId !== 'admin')
    await sequelize.query(`SET SESSION app.current_tenant = '${tenantId}'`);

  if ((connection[tenantId] || {}).isConnected) {
    console.log(`${tenantId} already connected, returning models`);
    return { sequelize, Sequelize, ...allModels };
  }

  console.log(`authenticating connection for ${tenantId}`);


  await sequelize.authenticate();
  connection[tenantId] = {
    isConnected: true,
  };

  return { sequelize, Sequelize, ...allModels };
}
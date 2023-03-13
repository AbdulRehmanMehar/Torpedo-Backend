import { QueryInterface, DataTypes, QueryTypes, Sequelize } from 'sequelize';

const tables = [
  'users',
  'addresses',
  'customers',
  'invoice_items',
  'invoices',
  'payments',
  'products',
  'tenants'
];

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      const { sequelize } = queryInterface;
      const promises: any[] = [];

      tables.forEach((t) => {
        promises.push(
          sequelize.query(
            `DROP POLICY IF EXISTS t1_${t}_iso_policy ON public.${t};`
          )
        );
        promises.push(
          sequelize.query(`ALTER TABLE ${t} ENABLE ROW LEVEL SECURITY;`)
        );
        promises.push(
          sequelize.query(
            `CREATE POLICY t1_${t}_iso_policy ON ${t} USING (${t === 'tenants' ? '"id"' : '"tenantId"'} = current_setting('app.current_tenant')::UUID);`
          )
        );
      });

      await Promise.all(promises);
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {

      const { sequelize } = queryInterface;
      const promises: any[] = [];
      tables.forEach((t) => {
        promises.push(
          sequelize.query(`ALTER TABLE ${t} DISABLE ROW LEVEL SECURITY;`)
        );
        promises.push(sequelize.query(`DROP POLICY t1_${t}_iso_policy ON ${t};`));
      });

      await Promise.all(promises);
    }
  )
};
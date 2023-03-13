import { QueryInterface, DataTypes, QueryTypes, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.addColumn('invoice_items', 'quantity', {
        type: DataTypes.INTEGER,
        allowNull: false,
      });

      await queryInterface.addColumn('invoice_items', 'invoiceId', {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'invoices',
          key: 'id'
        }
      });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.removeColumn('invoice_items', 'quantity');
      await queryInterface.removeColumn('invoice_items', 'invoiceId');
    }
  )
};
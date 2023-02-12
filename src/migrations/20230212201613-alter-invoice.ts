import { QueryInterface, DataTypes, QueryTypes, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.addColumn('invoices', 'customerId', {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'customers',
          key: 'id',
        }
      });

      await queryInterface.removeColumn('invoices', 'customerName');
      await queryInterface.removeColumn('invoices', 'customerPhone');
      await queryInterface.removeColumn('invoices', 'productName');
      await queryInterface.removeColumn('invoices', 'productQuantity');
      await queryInterface.removeColumn('invoices', 'productPrice');
      await queryInterface.removeColumn('invoices', 'productMeasurements');
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.removeColumn('invoices', 'customerId');

      await queryInterface.addColumn('invoices', 'customerName', {
        type: DataTypes.STRING,
        allowNull: false,
      });
      await queryInterface.addColumn('invoices', 'customerPhone', {
        type: DataTypes.STRING,
        allowNull: false,
      });
      await queryInterface.addColumn('invoices', 'productName', {
        type: DataTypes.STRING,
        allowNull: false,
      });
      await queryInterface.addColumn('invoices', 'productQuantity', {
        type: DataTypes.INTEGER,
        allowNull: false,
      });
      await queryInterface.addColumn('invoices', 'productPrice', {
        type: DataTypes.INTEGER,
        allowNull: false,
      });
      await queryInterface.addColumn('invoices', 'productMeasurements', {
        type: DataTypes.STRING,
        allowNull: false,
      });
    }
  )
};
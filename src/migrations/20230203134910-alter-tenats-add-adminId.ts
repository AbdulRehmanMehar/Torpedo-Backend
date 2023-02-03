import { QueryInterface, DataTypes, QueryTypes, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.addColumn('tenants', 'adminId', {
        type: DataTypes.UUID,
        allowNull: false,
      });
      await queryInterface.addColumn('tenants', 'indentifier', {
        type: DataTypes.STRING,
        allowNull: false,
      });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.removeColumn('tenants', 'adminId');
      await queryInterface.removeColumn('tenants', 'indentifier');
    }
  )
};
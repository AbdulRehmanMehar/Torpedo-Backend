import { QueryInterface, DataTypes, QueryTypes, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.changeColumn('tenants', 'name', {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      });

      await queryInterface.removeColumn('tenants', 'indentifier');
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.changeColumn('tenants', 'name', {
        type: DataTypes.STRING,
        allowNull: false,
        unique: false
      });

      await queryInterface.addColumn('tenants', 'indentifier', {
        type: DataTypes.STRING,
        allowNull: false,
      });
    }
  )
};
import { QueryInterface, DataTypes, QueryTypes, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.changeColumn('users', 'email', {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.changeColumn('users', 'email', {
        type: DataTypes.DOUBLE,
        allowNull: false,
      });
    }
  )
};
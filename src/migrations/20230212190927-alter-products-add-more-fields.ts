import { QueryInterface, DataTypes, QueryTypes, Sequelize } from 'sequelize';

module.exports = {
  up: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.addColumn('products', 'brand', {
        type: DataTypes.STRING,
        allowNull: false,
      });

      await queryInterface.addColumn('products', 'type', {
        type: DataTypes.ENUM('Tile', 'Others'),
        allowNull: false,
      });

      await queryInterface.addColumn('products', 'quality', {
        type: DataTypes.STRING,
        allowNull: true,
      });

      await queryInterface.addColumn('products', 'quantity', {
        type: DataTypes.INTEGER,
        allowNull: false,
      });
    }
  ),

  down: (queryInterface: QueryInterface): Promise<void> => queryInterface.sequelize.transaction(
    async (transaction) => {
      await queryInterface.removeColumn('products', 'type');
      await queryInterface.sequelize.query('DROP TYPE enum_products_type');
      await queryInterface.removeColumn('products', 'brand');
      await queryInterface.removeColumn('products', 'quality');
      await queryInterface.removeColumn('products', 'quantity');
    }
  )
};
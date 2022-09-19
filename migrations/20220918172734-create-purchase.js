'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Purchases', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      buyer_id: {
        type: Sequelize.STRING
      },
      item_id: {
        type: Sequelize.STRING
      },
      item_desc: {
        type: Sequelize.TEXT
      },
      price: {
        type: Sequelize.INTEGER
      },
      status: {
        type: Sequelize.STRING
      },
      bank_id: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Purchases');
  }
};
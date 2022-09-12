"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Bank extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Bank.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      money_name: { type: DataTypes.STRING, allowNull: false },
      classCode: { type: DataTypes.STRING, allowNull: false },
      eza: { type: DataTypes.INTEGER, allowNull: false },
      eza_term: { type: DataTypes.INTEGER, allowNull: false },
      next_eza_date: { type: DataTypes.DATE, allowNull: false },
    },
    {
      sequelize,
      modelName: "Bank",
    }
  );
  return Bank;
};

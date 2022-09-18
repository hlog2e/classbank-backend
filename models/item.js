"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Item extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Item.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      name: { type: DataTypes.STRING, allowNull: false },
      desc: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
      bank_id: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Item",
    }
  );
  return Item;
};

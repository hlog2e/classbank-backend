"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Purchase extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Purchase.init(
    {
      id: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      buyer_id: { type: DataTypes.STRING, allowNull: false },
      buyer_number: { type: DataTypes.STRING, allowNull: false },
      buyer_name: { type: DataTypes.STRING, allowNull: false },
      item_id: { type: DataTypes.STRING, allowNull: false },
      item_name: { type: DataTypes.TEXT, allowNull: true },
      price: { type: DataTypes.INTEGER, allowNull: false },
      status: { type: DataTypes.STRING, allowNull: false },
      bank_id: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "Purchase",
    }
  );
  return Purchase;
};

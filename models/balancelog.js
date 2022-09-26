"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class BalanceLog extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  BalanceLog.init(
    {
      id: { type: DataTypes.INTEGER, primaryKey: true },
      sender_id: DataTypes.STRING,
      sender_name: DataTypes.STRING,
      receiver_id: DataTypes.STRING,
      receiver_name: DataTypes.STRING,
      amount: DataTypes.INTEGER,
      reason: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "BalanceLog",
    }
  );
  return BalanceLog;
};

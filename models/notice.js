"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Notice extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Notice.init(
    {
      id: { type: DataTypes.INTEGER(11), allowNull: false, primaryKey: true },
      title: { type: DataTypes.STRING, allowNull: false },
      index: { type: DataTypes.TEXT("long"), allowNull: false },
    },
    {
      sequelize,
      modelName: "Notice",
    }
  );
  return Notice;
};

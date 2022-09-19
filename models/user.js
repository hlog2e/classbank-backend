"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  User.init(
    {
      user_uuid: { type: DataTypes.STRING, primaryKey: true, allowNull: false },
      user_id: { type: DataTypes.STRING, allowNull: false },
      password: { type: DataTypes.STRING, allowNull: false },
      password_salt: { type: DataTypes.STRING, allowNull: false },
      number: { type: DataTypes.STRING, allowNull: true },
      name: { type: DataTypes.STRING, allowNull: false },
      phone_number: { type: DataTypes.STRING, allowNull: false },
      type: { type: DataTypes.STRING, allowNull: false },
      bank_uuid: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      modelName: "User",
    }
  );
  return User;
};

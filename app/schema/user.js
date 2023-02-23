"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.user.hasMany(models.userLoginActivities, {
        foreignKey: "user_id",
      });
    }
  }
  user.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: DataTypes.STRING,
      password: DataTypes.STRING,
      isBlocked: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: DataTypes.STRING,
      email:DataTypes.STRING
    },
    {
      sequelize,
      modelName: "user",
    }
  );
  return user;
};



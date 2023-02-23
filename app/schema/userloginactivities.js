"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userLoginActivities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.userLoginActivities.belongsTo(models.user, {
        foreginKey: "user_id",
      });

    }
  }
  userLoginActivities.init(
    {
      id: {
        type:DataTypes.INTEGER,
        primaryKey:true,
        autoIncrement:true
      },
      user_id: DataTypes.STRING,
      ip: DataTypes.STRING,
      // userId:DataTypes.STRING
      isIpBlocked:DataTypes.STRING
    },
    {
      sequelize,
      modelName: "userLoginActivities",
    }
  );
  return userLoginActivities;
};




 
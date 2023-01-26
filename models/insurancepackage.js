'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InsurancePackage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  InsurancePackage.init({
    price: DataTypes.STRING,
    description: DataTypes.STRING,
    buy_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'InsurancePackage',
  });
  return InsurancePackage;
};
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
    name: DataTypes.STRING,
    cost: DataTypes.STRING,
    description: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'InsurancePackage',
  });
  return InsurancePackage;
};
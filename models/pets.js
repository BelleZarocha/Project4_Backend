'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Pets extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Pets.init({
    type: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    package_id: DataTypes.INTEGER,
    name: DataTypes.STRING,
    species: DataTypes.STRING,
    image: DataTypes.STRING,
    start_date: DataTypes.DATE,
    expire_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Pets',
  });
  return Pets;
};
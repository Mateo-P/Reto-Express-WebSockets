'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Message extends Model {
 
  };
  Message.init({
    author: DataTypes.STRING,
    message: DataTypes.STRING,
    ts: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Message',
  });
  return Message;
};
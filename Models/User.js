// models/UserModel.js
const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connection');

const User = sequelize.define('User', {
  Id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserName: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  Email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
});

class UserDTO {
    constructor(id, userName, email) {
      this.id = id;
     this.userName= userName;
      this.email = email;
    }
  }

module.exports = User;

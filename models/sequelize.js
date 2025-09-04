const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('your_database', 'username', 'password', {
  host: 'localhost',
  dialect: 'mysql',
  logging: console.log
});

module.exports = sequelize;
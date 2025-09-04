// models/ibr.js
"use strict";
module.exports = (sequelize, DataTypes) => {
  const Ibr = sequelize.define(
    "Ibr",
    {
      screenshot: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      voice: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      text: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "ibr",
      timestamps: true,
    }
  );

  return Ibr;
};

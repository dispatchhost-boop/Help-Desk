"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AutomationFlow extends Model {
    static associate(models) {
      // associations here if needed later
    }
  }

  AutomationFlow.init(
    {
      flow_name: {
        type: DataTypes.STRING(100),
        unique: true,
        allowNull: false,
      },
      start_msg: DataTypes.TEXT,
      true_msg: DataTypes.TEXT,
      false_msg: DataTypes.TEXT,
      confirm_msg: DataTypes.TEXT,
      time_options: DataTypes.STRING(255),
    },
    {
      sequelize,
      modelName: "AutomationFlow",
      tableName: "tbl_automation_flows",
      underscored: true,
    }
  );

  return AutomationFlow;
};

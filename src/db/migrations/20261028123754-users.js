"use strict";
import { DataTypes } from "sequelize";

export async function up(queryInterface) {
  await queryInterface.createTable("Users", {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    password: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    firstName: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    middleName: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    role: {
      type: DataTypes.ENUM(...Object.values(["duty", "engineer", "director"])),
      allowNull: false,
    },

    tokenVersion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable("Users");
}

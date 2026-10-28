'use strict';

import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('request_history', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    request_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'requests',
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    },

    user_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    user_role: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },

    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },

    field: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    old_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    new_value: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('request_history');
}
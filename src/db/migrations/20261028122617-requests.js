'use strict';
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('requests', {
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },

    equipment_id: {
      type: DataTypes.STRING(100),
      allowNull: true,
      references: {
        model: 'equipment',
        key: 'equipment_id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },

    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'normal',
    },

    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'new',
    },

    author_name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },

    author_contact: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },

    assignee: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },

    due_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    diagnostics: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    work_description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    waiting_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    closing_comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    completed_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    created_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },

    updated_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('requests');
}

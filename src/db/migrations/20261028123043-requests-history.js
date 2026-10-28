'use strict';
import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('equipment_history', {
    hist_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
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

    cur_state: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    reason_down: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    complete_repair: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    date_work_begin: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    date_work_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    date_repair_end: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    sec_data: {
      type: DataTypes.JSONB,
      allowNull: true,
    },
  });

}

export async function down(queryInterface) {
  await queryInterface.dropTable('equipment_history');
}
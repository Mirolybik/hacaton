import { DataTypes } from 'sequelize';

export async function up(queryInterface) {
  await queryInterface.createTable('equipment', {
    equipment_id: {
      type: DataTypes.STRING(100),
      allowNull: false,
      primaryKey: true,
    },

    equipment_name: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },

    level_0: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    level_1: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    level_2: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    level_3: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    level_4: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    level_5: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    level_6: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    type_obj_reg: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    date_com_ex: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    date_build: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    work_shed: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    usrful_life: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },

    inv_number: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    comment: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  });
}

export async function down(queryInterface) {
  await queryInterface.dropTable('equipment');
}
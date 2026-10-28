import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../../db';

export class Equipment extends Model<
  InferAttributes<Equipment>,
  InferCreationAttributes<Equipment>
> {
  declare equipmentId: string;
  declare equipmentName: string;
  declare level0: CreationOptional<string | null>;
  declare level1: CreationOptional<string | null>;
  declare level2: CreationOptional<string | null>;
  declare level3: CreationOptional<string | null>;
  declare level4: CreationOptional<string | null>;
  declare level5: CreationOptional<string | null>;
  declare level6: CreationOptional<string | null>;
  declare typeObjReg: CreationOptional<string | null>;
  declare dateCommissioned: CreationOptional<Date | null>;
  declare dateBuild: CreationOptional<Date | null>;
  declare workSchedule: CreationOptional<string | null>;
  declare usefulLifeMonths: CreationOptional<number | null>;
  declare inventoryNumber: CreationOptional<string | null>;
  declare comment: CreationOptional<string | null>;
}

Equipment.init(
  {
    equipmentId: {
      type: DataTypes.STRING(100),
      primaryKey: true,
      field: 'equipment_id',
    },
    equipmentName: {
      type: DataTypes.STRING(255),
      allowNull: false,
      field: 'equipment_name',
    },
    level0: { type: DataTypes.STRING(100), field: 'level_0' },
    level1: { type: DataTypes.STRING(100), field: 'level_1' },
    level2: { type: DataTypes.STRING(100), field: 'level_2' },
    level3: { type: DataTypes.STRING(100), field: 'level_3' },
    level4: { type: DataTypes.STRING(100), field: 'level_4' },
    level5: { type: DataTypes.STRING(100), field: 'level_5' },
    level6: { type: DataTypes.STRING(100), field: 'level_6' },
    typeObjReg: { type: DataTypes.STRING(100), field: 'type_obj_reg' },
    dateCommissioned: { type: DataTypes.DATE, field: 'date_com_ex' },
    dateBuild: { type: DataTypes.DATE, field: 'date_build' },
    workSchedule: { type: DataTypes.STRING(100), field: 'work_shed' },
    usefulLifeMonths: { type: DataTypes.INTEGER, field: 'usrful_life' },
    inventoryNumber: { type: DataTypes.STRING(255), field: 'inv_number' },
    comment: { type: DataTypes.TEXT },
  },
  {
    sequelize,
    modelName: 'Equipment',
    tableName: 'equipment',
    timestamps: false,
  },
);

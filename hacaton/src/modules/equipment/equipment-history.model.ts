import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../../db';
import { Equipment } from './equipment.model';

export class EquipmentHistory extends Model<
  InferAttributes<EquipmentHistory>,
  InferCreationAttributes<EquipmentHistory>
> {
  declare histId: CreationOptional<number>;
  declare equipmentId: CreationOptional<string | null>;
  declare curState: CreationOptional<string | null>;
  declare reasonDown: CreationOptional<string | null>;
  declare completeRepair: CreationOptional<string | null>;
  declare dateWorkBegin: CreationOptional<Date | null>;
  declare dateWorkEnd: CreationOptional<Date | null>;
  declare dateRepairEnd: CreationOptional<Date | null>;
  declare secData: CreationOptional<Record<string, unknown> | null>;
}

EquipmentHistory.init(
  {
    histId: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    equipmentId: {
      type: DataTypes.STRING(100),
      references: { model: Equipment, key: 'equipment_id' },
      onDelete: 'SET NULL',
    },
    curState: { type: DataTypes.STRING(100) },
    reasonDown: { type: DataTypes.TEXT },
    completeRepair: { type: DataTypes.TEXT },
    dateWorkBegin: { type: DataTypes.DATE },
    dateWorkEnd: { type: DataTypes.DATE },
    dateRepairEnd: { type: DataTypes.DATE },
    secData: { type: DataTypes.JSONB },
  },
  {
    sequelize,
    modelName: 'EquipmentHistory',
    tableName: 'equipment_history',
    timestamps: false,
    underscored: true,
  },
);

Equipment.hasMany(EquipmentHistory, {
  foreignKey: 'equipmentId',
  as: 'history',
});

EquipmentHistory.belongsTo(Equipment, {
  foreignKey: 'equipmentId',
  as: 'equipment',
});

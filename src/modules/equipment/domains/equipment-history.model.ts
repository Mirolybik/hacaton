import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from "sequelize-typescript";
import { Equipment } from "./equipment.model";

@Table({
  modelName: "EquipmentHistory",
  tableName: "equipment_history",
  timestamps: false,
  underscored: true,
})
export class EquipmentHistory extends Model<
  InferAttributes<EquipmentHistory>,
  InferCreationAttributes<EquipmentHistory>
> {
  @Column({
    type: DataType.INTEGER,
    primaryKey: true,
  })
  declare histId: string;

  @Column({
    type: DataType.UUID,
    primaryKey: true,
    onDelete: "SET NULL",
    allowNull: true,
  })
  @Column({
    type: DataType.STRING(100),
    allowNull: true,
  })
  declare curState: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare reasonDown: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare completeRepair: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dateWorkBegin: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dateWorkEnd: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare dateRepairEnd: string;

  @Column({
    type: DataType.JSONB,
    allowNull: true,
  })
  declare secData: string;

  @Column({
    type: DataType.UUID,
  })
  @ForeignKey(() => Equipment)
  declare equipmentId: string;

  @BelongsTo(() => Equipment)
  declare equipment: Equipment;
}

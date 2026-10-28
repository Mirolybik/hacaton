import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  BelongsToMany,
  Column,
  DataType,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { EquipmentHistory } from "./equipment-history.model";

@Table({
  modelName: "Equipment",
  tableName: "equipment",
  timestamps: false,
})
export class Equipment extends Model<
  InferAttributes<Equipment>,
  InferCreationAttributes<Equipment>
> {
  @Column({
    type: DataType.STRING(100),
    primaryKey: true,
    field: "equipment_id",
  })
  declare equipmentId: string;

  @Column({
    type: DataType.STRING(255),
    primaryKey: false,
    field: "equipment_name",
  })
  declare equipmentName: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: "level_0",
  })
  declare level0: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: "level_1",
  })
  declare level1: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: "level_2",
  })
  declare level2: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: "level_3",
  })
  declare level3: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: "level_4",
  })
  declare level4: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: "level_5",
  })
  declare level5: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: "level_6",
  })
  declare level6: string | null;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: "type_obj_reg",
  })
  declare typeObjReg: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "date_com_ex",
  })
  declare dateCommissioned: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
    field: "date_build",
  })
  declare dateBuild: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: true,
    field: "work_shed",
  })
  declare workSchedule: string;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
    field: "usrful_life",
  })
  declare usefulLifeMonths: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
    field: "inv_number",
  })
  declare inventoryNumber: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare comment: string | null;

  @HasMany(() => EquipmentHistory)
  declare history?: EquipmentHistory[];
}

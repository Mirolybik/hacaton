import { InferAttributes, InferCreationAttributes } from "sequelize";
import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from "sequelize-typescript";
import { User } from "../../user/domains/user.model";
import {
  REQUEST_PRIORITIES,
  REQUEST_STATUSES,
  REQUEST_TYPES,
  RequestStatus,
  RequestType,
  RequestPriority,
} from "./request-info.types";
import { Equipment } from "../../equipment/domains/equipment.model";

@Table({
  tableName: "requests",
  underscored: true,
})
export class Request extends Model<
  InferAttributes<Request>,
  InferCreationAttributes<Request>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  declare id: string;

  @Column({
    type: DataType.ENUM(...Object.values(REQUEST_TYPES)),
    allowNull: false,
  })
  declare type: RequestType;

  @Column({
    type: DataType.TEXT,
    allowNull: false,
  })
  declare description: string;

  @Column({
    type: DataType.ENUM(...Object.values(REQUEST_PRIORITIES)),
    allowNull: false,
    defaultValue: "normal",
  })
  declare priority: RequestPriority;

  @Column({
    type: DataType.ENUM(...Object.values(REQUEST_STATUSES)),
    allowNull: false,
    defaultValue: "new",
  })
  declare status: RequestStatus;

  @Column({
    type: DataType.STRING(150),
    allowNull: false,
  })
  declare authorName: string;

  @Column({
    type: DataType.STRING(200),
    allowNull: false,
  })
  declare authorContact: string;

  @Column({
    type: DataType.DATE,
    allowNull: false,
  })
  declare dueAt: Date;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare diagnostics: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare workDescription: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare waitingComment: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  declare closingComment: string;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  declare completedAt: Date;

  @Column({
    type: DataType.VIRTUAL,
    get() {
      const status = this.getDataValue("status");
      const dueAt = this.getDataValue("dueAt");
      return status !== "done" && new Date(dueAt) < new Date();
    },
  })
  declare overdue: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ForeignKey(() => User)
  declare userId: string;

  @BelongsTo(() => User)
  declare user?: User;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  @ForeignKey(() => Equipment)
  declare equipmentId: string;

  @BelongsTo(() => Equipment)
  declare equipment?: Equipment;
}

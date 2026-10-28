import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  Default,
  AllowNull,
  ForeignKey,
  BelongsTo,
  CreatedAt,
} from "sequelize-typescript";
import { Request } from "./request.model";

@Table({
  tableName: "request_history",
  underscored: true,
  updatedAt: false,
})
export class RequestHistory extends Model {
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  declare id: string;

  @ForeignKey(() => Request)
  @AllowNull(false)
  @Column({
    type: DataType.UUID,
    onDelete: "CASCADE",
  })
  declare requestId: string;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  declare userName: string;

  @AllowNull(false)
  @Column(DataType.STRING(30))
  declare userRole: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  declare action: string;

  @Column(DataType.STRING(100))
  declare field: string | null;

  @Column(DataType.TEXT)
  declare oldValue: string | null;

  @Column(DataType.TEXT)
  declare newValue: string | null;

  @CreatedAt
  declare createdAt: Date;

  @Column(DataType.UUID)
  declare userId: string;

  @BelongsTo(() => Request, {
    foreignKey: "requestId",
    as: "request",
  })
  declare request: Request;
}

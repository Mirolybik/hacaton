import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, HasMany, Model, Table } from "sequelize-typescript";
import { UserRole } from "./user-role.enum";
import { Request } from "../../requests/domains/request.model";

@Table
export class User extends Model<
  InferAttributes<User>,
  InferCreationAttributes<User>
> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    allowNull: false,
  })
  declare id: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare email: string;

  @Column({
    type: DataType.STRING(100),
    allowNull: false,
  })
  declare password: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare lastName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: false,
  })
  declare firstName: string;

  @Column({
    type: DataType.STRING(255),
    allowNull: true,
  })
  declare middleName: string;

  @Column({
    type: DataType.ENUM(...Object.values(UserRole)),
    allowNull: false,
  })
  declare role: UserRole;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  declare tokenVersion: number;

  @HasMany(() => Request)
  declare requests?: Request[];
}

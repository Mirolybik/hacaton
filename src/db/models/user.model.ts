import { InferAttributes, InferCreationAttributes } from "sequelize";
import { Column, DataType, Model, Table } from "sequelize-typescript";
import { UserRole } from "../../domains/enums/user-role.enum";

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
    type: DataType.VIRTUAL,
    get(this: User): string {
      return [this.lastName, this.firstName, this.middleName]
        .filter(Boolean)
        .join(" ");
    },
  })
  declare shortName: string;

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
}

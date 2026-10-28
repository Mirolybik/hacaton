import { DataTypes, Model } from "sequelize";
import { sequelize } from "../../../db";
import { Request } from "./request.model";

export class RequestHistory extends Model {
  declare id: string;
  declare requestId: string;
  declare userName: string;
  declare userRole: string;
  declare action: string;
  declare field: string | null;
  declare oldValue: string | null;
  declare newValue: string | null;
  declare createdAt: Date;
  declare userId: string;
}

RequestHistory.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    requestId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: Request, key: "id" },
      onDelete: "CASCADE",
    },
    userName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    userRole: {
      type: DataTypes.STRING(30),
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    field: {
      type: DataTypes.STRING(100),
    },
    oldValue: {
      type: DataTypes.TEXT,
    },
    newValue: {
      type: DataTypes.TEXT,
    },
  },
  {
    sequelize,
    tableName: "request_history",
    underscored: true,
    updatedAt: false,
  },
);

Request.hasMany(RequestHistory, {
  foreignKey: "requestId",
  as: "history",
  onDelete: "CASCADE",
});
RequestHistory.belongsTo(Request, { foreignKey: "requestId", as: "request" });

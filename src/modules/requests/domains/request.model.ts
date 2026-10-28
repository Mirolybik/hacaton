import {
  DataTypes,
  InferAttributes,
  InferCreationAttributes,
  Model,
} from "sequelize";
import { Equipment } from "../../equipment/equipment.model";
import { sequelize } from "../../../db";
import { RequestStatus, RequestType } from "./request-info.types";
import { Table } from "sequelize-typescript";
import { User } from "../../user/domains/user.model";

export class Request extends Model {
  declare id: string;
  declare type: RequestType;
  declare equipmentId: string | null;
  declare description: string;
  declare priority: RequestPriority;
  declare status: RequestStatus;
  declare authorName: string;
  declare authorContact: string;
  declare assignee: string | null;
  declare dueAt: Date;
  declare diagnostics: string | null;
  declare workDescription: string | null;
  declare waitingComment: string | null;
  declare closingComment: string | null;
  declare completedAt: Date | null;
  declare overdue: boolean;
  declare createdAt: Date;
  declare updatedAt: Date;
  declare authorId: string;
}

Request.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    equipmentId: {
      type: DataTypes.STRING(100),
      references: { model: Equipment, key: "equipment_id" },
      onDelete: "SET NULL",
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: "normal",
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: "new",
    },
    authorName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    authorContact: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    assignee: {
      type: DataTypes.STRING(150),
    },
    dueAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    diagnostics: {
      type: DataTypes.TEXT,
    },
    workDescription: {
      type: DataTypes.TEXT,
    },
    waitingComment: {
      type: DataTypes.TEXT,
    },
    closingComment: {
      type: DataTypes.TEXT,
    },
    completedAt: {
      type: DataTypes.DATE,
    },
    overdue: {
      type: DataTypes.VIRTUAL,
      get() {
        const status = this.getDataValue("status");
        const dueAt = this.getDataValue("dueAt");
        return status !== "done" && new Date(dueAt) < new Date();
      },
    },
  },
  {
    sequelize,
    tableName: "requests",
    underscored: true,
  },
);

Equipment.hasMany(Request, { foreignKey: "equipmentId", as: "requests" });
Request.belongsTo(Equipment, { foreignKey: "equipmentId", as: "equipment" });

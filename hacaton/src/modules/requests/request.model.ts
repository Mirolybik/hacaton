import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../../db';
import { Equipment } from '../equipment/equipment.model';
import type { RequestStatus } from './request-status';

export const REQUEST_TYPES = ['inspection', 'repair'] as const;

export type RequestType = (typeof REQUEST_TYPES)[number];

export const REQUEST_TYPE_LABELS: Record<RequestType, string> = {
  inspection: 'Осмотр',
  repair: 'Ремонт',
};

export const REQUEST_PRIORITIES = ['low', 'normal', 'high'] as const;

export type RequestPriority = (typeof REQUEST_PRIORITIES)[number];

export const REQUEST_PRIORITY_LABELS: Record<RequestPriority, string> = {
  low: 'Низкий',
  normal: 'Обычный',
  high: 'Высокий',
};

export class Request extends Model<
  InferAttributes<Request>,
  InferCreationAttributes<Request>
> {
  declare id: CreationOptional<string>;
  declare type: RequestType;
  declare equipmentId: CreationOptional<string | null>;
  declare description: string;
  declare priority: CreationOptional<RequestPriority>;
  declare status: CreationOptional<RequestStatus>;
  declare authorName: string;
  declare authorContact: string;
  declare assignee: CreationOptional<string | null>;
  declare dueAt: Date;
  declare diagnostics: CreationOptional<string | null>;
  declare workDescription: CreationOptional<string | null>;
  declare waitingComment: CreationOptional<string | null>;
  declare closingComment: CreationOptional<string | null>;
  declare completedAt: CreationOptional<Date | null>;
  declare createdAt: CreationOptional<Date>;
  declare updatedAt: CreationOptional<Date>;
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
      references: { model: Equipment, key: 'equipment_id' },
      onDelete: 'SET NULL',
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    priority: {
      type: DataTypes.STRING(20),
      allowNull: false,
      defaultValue: 'normal',
    },
    status: {
      type: DataTypes.STRING(30),
      allowNull: false,
      defaultValue: 'new',
    },
    authorName: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    authorContact: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    assignee: { type: DataTypes.STRING(150) },
    dueAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    diagnostics: { type: DataTypes.TEXT },
    workDescription: { type: DataTypes.TEXT },
    waitingComment: { type: DataTypes.TEXT },
    closingComment: { type: DataTypes.TEXT },
    completedAt: { type: DataTypes.DATE },
    createdAt: { type: DataTypes.DATE, allowNull: false },
    updatedAt: { type: DataTypes.DATE, allowNull: false },
  },
  {
    sequelize,
    modelName: 'Request',
    tableName: 'requests',
    underscored: true,
  },
);

Equipment.hasMany(Request, {
  foreignKey: 'equipmentId',
  as: 'requests',
});

Request.belongsTo(Equipment, {
  foreignKey: 'equipmentId',
  as: 'equipment',
});

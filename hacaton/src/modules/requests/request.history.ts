import {
  DataTypes,
  Model,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
} from 'sequelize';
import { sequelize } from '../../db';
import type { RequestRole } from './request-role';
import { Request } from './request.model';

export const REQUEST_HISTORY_ACTIONS = [
  'created',
  'updated',
  'status_changed',
  'assigned',
] as const;

export type RequestHistoryAction = (typeof REQUEST_HISTORY_ACTIONS)[number];

export type RequestHistoryValue =
  | string
  | number
  | boolean
  | null
  | RequestHistoryValue[]
  | { [key: string]: RequestHistoryValue };

export class RequestHistory extends Model<
  InferAttributes<RequestHistory>,
  InferCreationAttributes<RequestHistory>
> {
  declare id: CreationOptional<string>;
  declare requestId: string;
  declare actorName: string;
  declare actorRole: RequestRole;
  declare action: RequestHistoryAction;
  declare field: CreationOptional<string | null>;
  declare oldValue: CreationOptional<RequestHistoryValue>;
  declare newValue: CreationOptional<RequestHistoryValue>;
  declare createdAt: CreationOptional<Date>;
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
          references: { model: Request, key: 'id' },
          onDelete: 'CASCADE',
      },
      actorName: {
          type: DataTypes.STRING(150),
          allowNull: false,
      },
      actorRole: {
          type: DataTypes.STRING(30),
          allowNull: false,
      },
      action: {
          type: DataTypes.STRING(30),
          allowNull: false,
      },
      field: { type: DataTypes.STRING(100) },
      oldValue: { type: DataTypes.JSONB },
      newValue: { type: DataTypes.JSONB },
      createdAt: { type: DataTypes.DATE, allowNull: false }
  },
  {
    sequelize,
    modelName: 'RequestHistory',
    tableName: 'request_history',
    underscored: true,
    updatedAt: false,
  },
);

Request.hasMany(RequestHistory, {
  foreignKey: 'requestId',
  as: 'history',
  onDelete: 'CASCADE',
});

RequestHistory.belongsTo(Request, {
  foreignKey: 'requestId',
  as: 'request',
});
